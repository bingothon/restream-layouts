<template>
    <div :class="`Tracker ${alignment === 'horizontal' ? 'horizontal' : 'vertical'}`">
        <div :class="`counter-item ${!game.ep_boss ? 'greyed' : ''}`">
            <img :src="`${basePath}ep_boss.png`" />
            <img :class="`reward`" :src="`${basePath}/dungeon${game.ep_reward || 0}.png`" />
        </div>
        <div :class="`counter-item ${!game.dp_boss ? 'greyed' : ''}`">
            <img :src="`${basePath}dp_boss.png`" />
            <img :class="`reward`" :src="`${basePath}/dungeon${game.dp_reward || 0}.png`" />
        </div>
        <div :class="`counter-item ${!game.th_boss ? 'greyed' : ''}`">
            <img :src="`${basePath}th_boss.png`" />
            <img :class="`reward`" :src="`${basePath}/dungeon${game.th_reward || 0}.png`" />
        </div>
        <div :class="`counter-item ${!game.pod_boss ? 'greyed' : ''}`">
            <img :src="`${basePath}pod_boss.png`" />
            <img :class="`reward`" :src="`${basePath}/dungeon${game.pod_reward || 0}.png`" />
        </div>
        <div :class="`counter-item ${!game.sp_boss ? 'greyed' : ''}`">
            <img :src="`${basePath}sp_boss.png`" />
            <img :class="`reward`" :src="`${basePath}/dungeon${game.sp_reward || 0}.png`" />
        </div>
        <div :class="`counter-item ${!game.sw_boss ? 'greyed' : ''}`">
            <img :src="`${basePath}sw_boss.png`" />
            <img :class="`reward`" :src="`${basePath}/dungeon${game.sw_reward || 0}.png`" />
        </div>
        <div :class="`counter-item ${!game.tt_boss ? 'greyed' : ''}`">
            <img :src="`${basePath}tt_boss.png`" />
            <img :class="`reward`" :src="`${basePath}/dungeon${game.tt_reward || 0}.png`" />
        </div>
        <div :class="`counter-item ${!game.ip_boss ? 'greyed' : ''}`">
            <img :src="`${basePath}ip_boss.png`" />
            <img :class="`reward`" :src="`${basePath}/dungeon${game.ip_reward || 0}.png`" />
        </div>
        <div :class="`counter-item ${!game.mm_boss ? 'greyed' : ''}`">
            <img :src="`${basePath}mm_boss.png`" />
            <img :class="`reward`" :src="`${basePath}/dungeon${game.mm_reward || 0}.png`" />
        </div>
        <div :class="`counter-item ${!game.tr_boss ? 'greyed' : ''}`">
            <img :src="`${basePath}tr_boss.png`" />
            <img :class="`reward`" :src="`${basePath}/dungeon${game.tr_reward || 0}.png`" />
        </div>
        <div :class="`${!game.bow ? 'greyed' : ''}`">
            <img :src="`${basePath}bow${game.bow || 0}.png`" />
        </div>
        <div :class="`${!game.boomerang ? 'greyed' : ''}`">
            <img :src="`${basePath}boomerangs${game.boomerang || 0}.png`" />
        </div>
        <div :class="`${!game.hookshot ? 'greyed' : ''}`">
            <img :src="`${basePath}hookshot.png`" />
        </div>
        <div :class="`${!game.bombs ? 'greyed' : ''}`">
            <img :src="`${basePath}bombs.png`" />
        </div>
        <div :class="`${!game.mushroom ? 'greyed' : ''}`">
            <img :src="`${basePath}mushroom.png`" />
        </div>
        <div :class="`${!game.powder ? 'greyed' : ''}`">
            <img :src="`${basePath}powder.png`" />
        </div>
        <div :class="`${!game.glove ? 'greyed' : ''}`">
            <img :src="`${basePath}glove${game.glove || 0}.png`" />
        </div>
        <div :class="`${!game.boots ? 'greyed' : ''}`">
            <img :src="`${basePath}boots.png`" />
        </div>
        <div :class="`${!game.flippers ? 'greyed' : ''}`">
            <img :src="`${basePath}flippers.png`" />
        </div>
        <div :class="`${!game.pearl ? 'greyed' : ''}`">
            <img :src="`${basePath}pearl.png`" />
        </div>
        <div :class="`${!game.firerod ? 'greyed' : ''}`">
            <img :src="`${basePath}firerod.png`" />
        </div>
        <div :class="`${!game.icerod ? 'greyed' : ''}`">
            <img :src="`${basePath}icerod.png`" />
        </div>
        <div :class="`${!game.bombos ? 'greyed' : ''}`">
            <img :src="`${basePath}bombos.png`" />
        </div>
        <div :class="`${!game.ether ? 'greyed' : ''}`">
            <img :src="`${basePath}ether.png`" />
        </div>
        <div :class="`${!game.quake ? 'greyed' : ''}`">
            <img :src="`${basePath}quake.png`" />
        </div>
        <div :class="`${!game.shovel ? 'greyed' : ''}`">
            <img :src="`${basePath}shovel.png`" />
        </div>
        <div :class="`${!game.lamp ? 'greyed' : ''}`">
            <img :src="`${basePath}lamp.png`" />
        </div>
        <div :class="`${!game.hammer ? 'greyed' : ''}`">
            <img :src="`${basePath}hammer.png`" />
        </div>
        <div :class="`${!game.flute ? 'greyed' : ''}`">
            <img :src="`${basePath}flute.png`" />
        </div>
        <div :class="`${!game.net ? 'greyed' : ''}`">
            <img :src="`${basePath}net.png`" />
        </div>
        <div :class="`${!game.book ? 'greyed' : ''}`">
            <img :src="`${basePath}book.png`" />
        </div>
        <div :class="`counter-item ${!game.bottle ? 'greyed' : ''}`">
            <img :src="`${basePath}bottle.png`" />
            <span :class="`Counter`"> {{ game.bottle || 0 }} </span>
        </div>
        <div :class="`${!game.somaria ? 'greyed' : ''}`">
            <img :src="`${basePath}somaria.png`" />
        </div>
        <div :class="`${!game.byrna ? 'greyed' : ''}`">
            <img :src="`${basePath}byrna.png`" />
        </div>
        <div :class="`${!game.cape ? 'greyed' : ''}`">
            <img :src="`${basePath}cape.png`" />
        </div>
        <div :class="`${!game.mirror ? 'greyed' : ''}`">
            <img :src="`${basePath}mirror.png`" />
        </div>

        <div :class="`${!game.halfmagic ? 'greyed' : ''}`">
            <img :src="`${basePath}halfmagic.png`" />
        </div>
        <div :class="`${!game.sword ? 'greyed' : ''}`">
            <img :src="`${basePath}sword${game.sword || 0}.png`" />
        </div>
        <div>
            <img :src="`${basePath}tunic${game.tunic || 0 + 1}.png`" />
        </div>
        <div :class="`${!game.aga ? 'greyed' : ''}`">
            <img :src="`${basePath}aga.png`" />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
    import { store } from '@/browser-util/state'
    import { Games } from '../../../types'
    import { TrackerData } from '@/schemas'

    @Component({
        components: {},
    })
    export default class Tracker extends Vue {
        @Watch('trackerData')
        onTrackerDataChange(): void {
            console.log('watcher function for trackers')
            this.updateTrackers()
        }

        @Prop({ required: true, default: 1 })
        playerNumber: string // actually a number but who cares about types? shrug

        @Prop({ default: 'vertical' })
        alignment: string

        basePath = '/bundles/restream-layouts/static/tracker/alttpr/'

        mounted() {
            this.updateTrackers()
        }

        get game(): Games {
            let player = parseInt(this.playerNumber)
            switch (player) {
                case 4:
                    return store.state.gameP4
                case 3:
                    return store.state.gameP3
                case 2:
                    return store.state.gameP2
                case 1:
                default:
                    return store.state.gameP1
            }
        }

        get trackerData(): TrackerData {
            return store.state.trackerData
        }

        updateTrackers() {
            console.log('update trackers')
            let player = parseInt(this.playerNumber)
            switch (player) {
                case 4:
                    store.dispatch('unbindGameP4')
                    store.dispatch('bindGameP4', { gameId: this.trackerData[3].id })
                    break
                case 3:
                    store.dispatch('unbindGameP3')
                    store.dispatch('bindGameP3', { gameId: this.trackerData[2].id })
                    break
                case 2:
                    store.dispatch('unbindGameP2')
                    store.dispatch('bindGameP2', { gameId: this.trackerData[1].id })
                    break
                case 1:
                default:
                    store.dispatch('unbindGameP1')
                    store.dispatch('bindGameP1', { gameId: this.trackerData[0].id })
            }
        }
    }
</script>

<style scoped>
    .Tracker {
        display: grid;
        justify-items: center;
        align-items: center;
    }

    .horizontal {
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(4, 1fr);
    }

    .vertical {
        grid-template-columns: '35px 35px 35px 35px';
    }

    .greyed {
        filter: opacity(25%);
    }

    /* Number on Item */
    .counter-item {
        position: relative;
        align-content: center;
        text-align: center;
        font-size: 18pt;
    }
    .Counter {
        position: absolute;
        transform: translate(-50%, -60%);
        left: 50%;
        top: 50%;
        /* -webkit-text-stroke: 1px white; */
        color: white;
        font-weight: bold;
    }

    .reward {
        position: absolute;
        transform: translate(-50%, -40%);
        left: 80%;
        top: 70%;
        width: 25px;
    }

    img {
        width: 30px;
        justify-self: center;
    }
</style>
