(function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s="c4aa")})({c4aa:function(e,t){(function(){self.onmessage=function(t){e.transToAudioData(t.data)};var e={transToAudioData:function(t,r=16e3,n=22505){let o=e.base64ToS16(t),a=e.transS16ToF32(o);a=e.transSamplingRate(a,r,n),a=Array.from(a),self.postMessage({data:a,rawAudioData:Array.from(o)})},transSamplingRate:function(e,t=44100,r=16e3){var n=Math.round(e.length*(r/t)),o=new Float32Array(n),a=(e.length-1)/(n-1);o[0]=e[0];for(let c=1;c<n-1;c++){var u=c*a,f=Math.floor(u).toFixed(),i=Math.ceil(u).toFixed(),l=u-f;o[c]=e[f]+(e[i]-e[f])*l}return o[n-1]=e[e.length-1],o},transS16ToF32:function(e){var t=[];for(let n=0;n<e.length;n++){var r=e[n]<0?e[n]/32768:e[n]/32767;t.push(r)}return new Float32Array(t)},base64ToS16:function(e){e=atob(e);const t=new Uint8Array(e.length);for(let r=0;r<e.length;++r)t[r]=e.charCodeAt(r);return new Int16Array(new DataView(t.buffer).buffer)}}})()}});