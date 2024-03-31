import Vue from 'vue'
import App from './main.vue'
import { create } from '../../browser-util/state'
import vuetify from '../_misc/vuetify'

create().then(() => {
    new Vue({
        el: '#App',
        vuetify,
        render: (h) => h(App),
    })
})
