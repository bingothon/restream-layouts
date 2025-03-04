import Vue from 'vue';
import App from '../game-layout/3_2-4p.vue';
import { create } from '../../browser-util/state';

create().then(() => {
    new Vue({
        el: '#App',
        render: (h) => h(App)
    });
});
