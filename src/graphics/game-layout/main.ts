import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout1 from './layout1.vue';
import { create } from "../../browser-util/state";
import * as Layouts from "./layout-list.vue"

Vue.use(VueRouter);

const routes = [
  {name: "Test Layout", path: "/test-layout", component: Layout1},
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