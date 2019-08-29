import Vue from 'vue';
import VueRouter from 'vue-router';
import { create } from "../../browser-util/state";
import * as Layouts from "./layout-list";

Vue.use(VueRouter);

const routes = [
  {name: "Test Layout", path: "/test-layout", component: Layouts.TestLayout},
  {name: "4p 4:3 co-op Layout", path: "/4p-4_3-co-op-layout", component: Layouts.Layout_4x3_4p_CoOp},
  {name: "3p 4:3 Layout", path: "/3p-4_3-layout", component: Layouts.Layout_4x3_3p},
  {name: "2p 4:3 Layout", path: "/2p-4_3-layout", component: Layouts.Layout_4x3_2p},
  {name: "1p 4:3 Layout", path: "/1p-4_3-layout", component: Layouts.Layout_4x3_1p},
  {name: "4p 16:9 Layout", path: "/4p-16_9-layout", component: Layouts.Layout_16x9_4p},
  {name: "3p 16:9 Layout", path: "/3p-16_9-layout", component: Layouts.Layout_16x9_3p},
  {name: "1p 16:9 Layout", path: "/1p-16_9-layout", component: Layouts.Layout_16x9_1p},
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