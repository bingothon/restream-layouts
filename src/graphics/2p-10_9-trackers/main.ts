import Vue from 'vue'
import App from '../game-layout/10_9-2p-trackers.vue'
import { create } from '../../browser-util/state'

create().then(() => {
    new Vue({
        el: '#App',
        render: (h) => h(App),
    })
})
