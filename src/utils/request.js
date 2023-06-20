import axios from 'axios';
import store from '@/store';

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base api url + request url
  // withCredentials: false, // send cookies when cross-domain requests
  timeout: 20000, // request timeout
});

function unzip(b64Data) {
  // const strData = atob(b64Data);
  const charData = b64Data.split('').map(function (x) {
    return x.charCodeAt(0);
  });
  const binData = new Uint8Array(charData);
  const data = pako.inflate(binData);
  const array = new Uint16Array(data);
  // 防止一次解压造成内存溢出，这里进行分段解压
  let result = '';
  let i = 0;
  const maxRange = 8 * 1024;
  for (i = 0; i < array.length / maxRange; i++) {
    result += String.fromCharCode.apply(null, array.slice(i * maxRange, (i + 1) * maxRange));
  }
  result += String.fromCharCode.apply(null, array.slice(i * maxRange));
  try {
    return decodeURIComponent(result);
  } catch (error) {
    return result;
  }
}

// 压缩
function zip(str) {
  return pako.gzip(str, { to: 'string' });
}

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    config.baseURL = store.getters.appGlobal.apiHost;
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'text/plain';
    if (config.data && config.headers['Content-Type'] != 'multipart/form-data') {
      if (typeof config.data !== 'string') {
        config.data = JSON.stringify(config.data);
      }
      if (process.env.VUE_APP_NEED_REQUEST_ZIP == 'true') {
        config.data = zip(config.data);
      }
    }
    config.headers['token'] = store.getters.appGlobal.token;
    config.headers['channelCode'] = store.getters.appGlobal.channelCode || 'google';
    config.headers['mobileType'] = store.getters.appGlobal.mobileType || '2';
    config.headers['gps'] = store.getters.appGlobal.gps;
    config.headers['gpsAddress'] = encodeURIComponent(store.getters.appGlobal.gpsAddress);
    config.headers['afId'] = store.getters.appGlobal.afId;
    config.headers['gaId'] = store.getters.appGlobal.gaId;
    config.headers['appName'] = store.getters.appGlobal.appName;
    config.headers['appVersion'] = store.getters.appGlobal.appVersion;
    config.headers['timestamp'] = new Date().getTime();
    // config.headers['Accept'] = '*/*';
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response拦截图
service.interceptors.response.use(
  response => {
    let res;
    try {
      res = JSON.parse(unzip(response.data));
    } catch (error) {
      res = response.data;
    }
    console.log(response.config.url, res);
    if (res.returnCode && res.returnCode !== 2000) {
      // 4005: 登录超时,重新登录
      // 4006: 强制升级
      if (res.returnCode === 4005 || res.returnCode === 4006) {
        try {
          let appGlobal = JSON.parse(localStorage.getItem('app-local'));
          wjs[`errorCode_${appGlobal.appName}`](JSON.stringify({ code: res.returnCode, msg: res.message }));
        } catch (error) {
          return Promise.reject(res || 'error');
        }
      } else {
        return Promise.reject(res || 'error');
      }
    } else {
      return Promise.resolve(res);
    }
  },
  error => {
    // if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
    //   console.log('Request timed out');
    //   return Promise.reject({ message: 'Tiempo de espera, inténtelo de nuevo' });
    // }
    return Promise.reject(error);
  }
);

export default service;
