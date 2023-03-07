import{S as l}from"./sweetalert2.all-b5115aad.js";import{_ as h,c as d,a as t,F as g,z as f,A as r,B as w,C as v,d as b,E as x,o as c}from"./index-806c1ca4.js";import{_ as y}from"./loading-26e6df6d.js";const{VITE_URL:a,VITE_PATH:u}={VITE_URL:"https://vue3-course-api.hexschool.io/v2/",VITE_PATH:"kevin-jiang",BASE_URL:"/week7-Vue/",MODE:"production",DEV:!1,PROD:!0},I={data(){return{product:{},NewQty:1,loadingItem:""}},methods:{getProduct(){this.$http.get(`${a}/api/${u}/product/${this.$route.params.id}`).then(e=>{this.product=e.data.product,this.NewQty=1})},addCart(e,o){const n={product_id:e,qty:o};this.loadingItem=e,this.$http.post(`${a}api/${u}/cart`,{data:n}).then(p=>{this.loadingItem="",l.fire({position:"top-end",icon:"success",title:"加入購物車成功(ﾉ>ω<)ﾉ",showConfirmButton:!1,timer:1500,toast:!0}),this.getProduct()}).catch(()=>{l.fire({icon:"error",title:"加入購物車失敗(‘⊙д-)",showConfirmButton:!1,timer:1500})})}},mounted(){this.getProduct()}},V=t("h2",null,"單一產品介紹",-1),E={class:"row"},N={class:"col-md-4"},T=["src"],k={class:"row mt-3"},B=["src"],C={class:"col-md-8 text-start d-flex justify-content-between flex-column"},P={class:"p-3 pt-0"},U={class:"badge rounded-pill text-bg-primary fs-5 text-white mb-3"},D={class:"fs-5"},Q={class:"fs-5"},S={class:"row"},A=t("div",{class:"col-md-6"},null,-1),L={class:"col-md-6 text-end"},R={class:"input-group text-end mt-5"},j=["disabled"],F=["disabled"],H={key:0,src:y,alt:"loading",width:"20"};function M(e,o,n,p,s,_){return c(),d("div",null,[V,t("div",E,[t("div",N,[t("img",{src:s.product.imageUrl,alt:"主要圖片",class:"img-fluid w-100"},null,8,T),t("div",k,[(c(!0),d(g,null,f(s.product.imagesUrl,(i,m)=>(c(),d("div",{class:"col-md-6",key:m+"image"},[t("img",{src:i,alt:"次要圖片",class:"img-fluid"},null,8,B)]))),128))])]),t("div",C,[t("div",P,[t("span",U,r(s.product.category),1),t("p",D,"商品名稱:"+r(s.product.title),1),t("p",Q,"商品內容:"+r(s.product.description),1)]),t("div",S,[A,t("div",L,[t("div",R,[w(t("input",{type:"number",min:"1",class:"form-control w-50","onUpdate:modelValue":o[0]||(o[0]=i=>s.NewQty=i),disabled:s.loadingItem===s.product.id},null,8,j),[[v,s.NewQty]]),t("button",{class:"btn btn-primary btn-lg",onClick:o[1]||(o[1]=i=>_.addCart(s.product.id,s.NewQty)),disabled:s.loadingItem===s.product.id},[b(" 加入購物車 "),s.loadingItem===s.product.id?(c(),d("img",H)):x("",!0)],8,F)])])])])])])}const G=h(I,[["render",M]]);export{G as default};
