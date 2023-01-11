(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["loan-confirm"],{"4d23":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t._self._c;return e("div",{staticClass:"loan-confirm"},[e("div",{staticClass:"head"},[e("m-icon",{staticClass:"icon",attrs:{type:"loan/repayment",width:30,height:24}}),t._v(" Repayment ")],1),e("div",{staticClass:"loan-info"},[e("div",{staticClass:"item"},[e("span",[t._v("Loan Amount")]),e("span",{staticClass:"fs-24 font-bold color-000"},[t._v("₹"+t._s(t.orderInfo.actualAmount))])]),e("div",{staticClass:"item"},[e("span",[t._v("Application Date")]),e("span",[t._v(t._s(t._f("dateFormate")(t.orderInfo.applyTime,"yyyy/MM/dd")))])]),e("div",{staticClass:"item"},[e("span",[t._v("Due Date")]),e("span",[t._v(t._s(t._f("dateFormate")(t.orderInfo.expectedRepaymentTime,"yyyy/MM/dd")))])]),e("div",{staticClass:"item"},[e("span",[t._v("Wallet Number")]),e("span",[t._v(t._s(t.orderInfo.bankCardNo))])]),e("div",{staticClass:"item"},[e("span",[t._v("Wallet Method")]),e("span",[t._v(t._s(t.orderInfo.bankCardName))])])]),e("div",{staticClass:"loan-desc"},[t._v("The specific amount will be confirmed after reviewing. If your order is approved, we will charge the processing fee, including the service fee (no more than 7%), review fee (8%-15%), and GST(18%) This page is for reference only. The amount will be credited to your account directly after approval.")]),e("div",{staticClass:"submit"},[e("button",{attrs:{disabled:!t.canSubmit},on:{click:t.submit}},[t._v("Submit")]),e("div",{staticClass:"policy",on:{click:t.togglePolicy}},[e("m-icon",{staticClass:"icon",attrs:{type:t.choosed?"radio-choosed":"radio-unchoose",width:14,height:14}}),t._v(" I have read and agreed to the  "),e("span",{on:{click:t.goPrivacy}},[t._v(" Privacy Policy")]),t._v("  &  "),e("span",{attrs:{click:"goTerms"}},[t._v("Terms of Use")])],1)])])},i=[],o={watch:{choosed:{handler(){this.canSubmit=!!this.choosed},deep:!0}},data(){return{choosed:!0,canSubmit:!0,orderInfo:""}},mounted(){this.getOrderInfo()},methods:{togglePolicy(){this.choosed=!this.choosed},async getOrderInfo(){let t=await this.$http.post("/zihai/bmzcxadafkbywtijqa",{orderId:this.$route.query.orderId}),e=await this.$http.post("/zihai/bmzcxadafkbywtijqz",{orderId:this.$route.query.orderId});this.orderInfo={...t.data,...e.data},console.log(this.orderInfo)},async submit(){try{let t=await this.$http.post("/zihai/bmzcx",{orderId:this.$route.query.orderId});2e3==t.returnCode&&this.innerJump("loan-success",{orderId:this.$route.query.orderId},!0)}catch(t){this.$toast(t.message),this.innerJump("loan-fail",{orderId:this.$route.query.orderId},!0)}}}},r=o,n=(a("7920"),a("e607")),d=Object(n["a"])(r,s,i,!1,null,"bd071258",null);e["default"]=d.exports},7920:function(t,e,a){"use strict";a("b8f9")},b8f9:function(t,e,a){}}]);