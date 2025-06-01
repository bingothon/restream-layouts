import Vue from 'vue';
import App from '../game-layout/ds-focus-touch-2p.vue';
import { create } from '../../browser-util/state';

create().then(() => {
    new Vue({
        el: '#App',
        render: (h) => h(App)
    });
});
