import Vue from 'vue';
import App from '../game-layout/4_3-4p-big-board.vue';
import {create} from '../../browser-util/state';

create().then(() => {
    new Vue({
        el: '#App',
        render: h => h(App),
    });
});
