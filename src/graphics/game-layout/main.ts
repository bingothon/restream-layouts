import Vue from 'vue';
import VueRouter from 'vue-router';
import { create, getReplicant } from '../../browser-util/state';
import * as Layouts from './layout-list';
import { AllGameLayouts, CurrentGameLayout } from '../../../schemas';
import GameLayout from './main.vue';

Vue.use(VueRouter);

const routes = [
    { name: '2p 4:3 Layout', path: '/2p-4_3-layout', component: Layouts.Layout_4x3_2p },
    { name: '1p 4:3 Layout', path: '/1p-4_3-layout', component: Layouts.Layout_4x3_1p },
    { name: '6p 16:9 layout', path: '/6p-16_9-layout', component: Layouts.Layout_16x9_6p },
    { path: '*', redirect: '/2p-4_3-layout' }
];

// put all of the game layouts in the replicant
const allGameLayouts = routes
    .map((r) => {
        return { name: r.name || '', path: r.path || '' };
    })
    .filter((r) => !!r.name);
getReplicant<AllGameLayouts>('allGameLayouts').value = allGameLayouts;

const router = new VueRouter({
    routes
});

// if the replicant changes, update the game layouts route
getReplicant<CurrentGameLayout>('currentGameLayout').on('change', (newVal) => {
    // don't switch to invalid layouts
    if (allGameLayouts.map((n) => n.name).includes(newVal.name)) {
        console.log('switching to', newVal);
        router.push({ name: newVal.name });
    } else {
        console.log('invalid layout:', newVal);
    }
});

create().then(() => {
    new Vue({
        router,
        render: (h) => h(GameLayout)
    }).$mount('#App');
});
