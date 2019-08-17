import Vue from 'vue';
import GameLayout from './layout1.vue';
import {create} from '../../browser-util/state';

create().then(() => {
  new Vue({
    el: '#App',
    render: h => h(GameLayout),
  });
});