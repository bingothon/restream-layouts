import Vue from 'vue';
import VueRouter from 'vue-router';
import { create } from "../../browser-util/state";
import * as Interviews from "./interview-list"

Vue.use(VueRouter);

const routes = [
	{name: "4p Interview", path: "/interview-4p", component: Interviews.Interview_4p},
	{name: "4p CoOp Interview", path: "/interview-4p-CoOp", component: Interviews.Interview_4p_CoOp},
	{name: "Pure Earth Interview", path: "/interview-PE", component: Interviews.Interview_PureEarth},
	{path: "*", redirect: "/interview-4p"},
];

const router = new VueRouter({
	routes,
});

create().then(()=> {
	new Vue({
		router,
	}).$mount('#app');
});
