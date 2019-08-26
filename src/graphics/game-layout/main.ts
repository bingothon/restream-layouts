import Vue from 'vue';
import VueRouter from 'vue-router';
import { create } from "../../browser-util/state";
import * as Layouts from "./layout-list";

Vue.use(VueRouter);

const routes = [
  {name: "Test Layout", path: "/test-layout", component: Layouts.TestLayout},
  {name: "4p 4:3 co-op Layout", path: "/4p-4_3-co-op-layout", component: Layouts.Layout_4x3_4p_CoOp},
  {name: "4p 16:9 Layout", path: "/4p-16_9-layout", component: Layouts.Layout_16x9_4p},
  {path: "*", redirect: "/test-layout"},
];

const router = new VueRouter({
  routes,
});

create().then(()=> {
  new Vue({
    router,
  }).$mount('#app');
});