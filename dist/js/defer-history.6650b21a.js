(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["defer-history"],{"8d1b":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t._self._c;return e("div",{staticClass:"defer-history"},t._l(t.lists,(function(s){return e("div",{key:s,staticClass:"items"},[e("div",{staticClass:"head fs-18"},[t._v("Deferment xx")]),e("div",{staticClass:"flex-between"},[e("span",[t._v("Deferment term")]),e("span",[t._v(t._s(s.iqfiwekkwdcs)+" days")])]),e("div",{staticClass:"flex-between"},[e("span",[t._v("Application date")]),e("span",[t._v(t._s(s.uueveoyxnxfi))])]),e("div",{staticClass:"flex-between"},[e("span",[t._v("Updated due date")]),e("span",[t._v(t._s(s.tumurdmntdburd))])]),e("div",{staticClass:"flex-between"},[e("span",[t._v("Repayment amount")]),e("span",[t._v("₹ "+t._s(s.unwtwi))])])])})),0)},i=[],n={data(){return{lists:[1,2]}},mounted(){this.getDeferHistory()},methods:{async getDeferHistory(){let t=await this.$http.post("/uzeaulazu/kgwhjiyu",{id:this.$route.query.orderId}),e=await this.$http.post("/uzeaulazu/kgwhjiyj",{id:this.$route.query.orderId});this.lists=this.mergeTwoArray(t.data.list,e.data.list)}}},r=n,d=(s("a629"),s("e607")),u=Object(d["a"])(r,a,i,!1,null,"1cc768d0",null);e["default"]=u.exports},a629:function(t,e,s){"use strict";s("cc9e")},cc9e:function(t,e,s){}}]);