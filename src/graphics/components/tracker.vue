<template>
    <div
        class="Tracker"
        :style="`grid-template-columns: ${
            alignment === 'horizontal'
                ? '40px 40px 40px 40px 40px 40px 40px 40px 40px 40px 40px 40px'
                : '35px 35px 35px 35px'
        }`"
    >
        <div :class="`${!game.sword ? 'greyed' : ''}`">
            <img :src="`${basePath}SWORD_${game.sword || 0}.png`" />
        </div>
        <div :class="`${!game.feather ? 'greyed' : ''}`">
            <img :src="`${basePath}FEATHER_1.png`" />
        </div>
        <div :class="`${!game.bracelet ? 'greyed' : ''}`">
            <img :src="`${basePath}POWER_BRACELET_${game.bracelet || 0}.png`" />
        </div>
        <div :class="`${!game.instrument1 ? 'greyed' : ''}`">
            <img :src="`${basePath}INSTRUMENT1_1.png`" />
        </div>
        <div :class="`${!game.boots ? 'greyed' : ''}`">
            <img :src="`${basePath}PEGASUS_BOOTS_1.png`" />
        </div>
        <div :class="`${!game.flippers ? 'greyed' : ''}`">
            <img :src="`${basePath}FLIPPERS_1.png`" />
        </div>
        <div :class="`${!game.hookshot ? 'greyed' : ''}`">
            <img :src="`${basePath}HOOKSHOT_1.png`" />
        </div>
        <div :class="`${!game.instrument2 ? 'greyed' : ''}`">
            <img :src="`${basePath}INSTRUMENT2_1.png`" />
        </div>
        <div :class="`${!game.shield ? 'greyed' : ''}`">
            <img :src="`${basePath}SHIELD_1.png`" />
        </div>
        <div :class="`${!game.rod ? 'greyed' : ''}`">
            <img :src="`${basePath}MAGIC_ROD_1.png`" />
        </div>
        <div :class="`${!game.shovel ? 'greyed' : ''}`">
            <img :src="`${basePath}SHOVEL_1.png`" />
        </div>
        <div :class="`${!game.instrument3 ? 'greyed' : ''}`">
            <img :src="`${basePath}INSTRUMENT3_1.png`" />
        </div>
        <div :class="`${!game.bow ? 'greyed' : ''}`">
            <img :src="`${basePath}BOW_1	.png`" />
        </div>
        <div :class="`${!game.bombs ? 'greyed' : ''}`">
            <img :src="`${basePath}BOMB_1.png`" />
        </div>
        <div :class="`Leaf ${!game.leafs ? 'greyed' : ''}`">
            <img :src="`${basePath}GOLD_LEAF_1.png`" />
            <span :class="`Counter`"> {{ game.leafs || 0 }} </span>
        </div>
        <div :class="`${!game.instrument4 ? 'greyed' : ''}`">
            <img :src="`${basePath}INSTRUMENT4_1.png`" />
        </div>
        <div :class="`${!game.boomerang ? 'greyed' : ''}`">
            <img :src="`${basePath}BOOMERANG_1.png`" />
        </div>
        <div :class="`${!game.powder ? 'greyed' : ''}`">
            <img :src="`${basePath}MAGIC_POWDER_1.png`" />
        </div>
        <div :class="`${!game.ocarina ? 'greyed' : ''}`">
            <img :src="`${basePath}OCARINA_1.png`" />
        </div>
        <div :class="`${!game.instrument5 ? 'greyed' : ''}`">
            <img :src="`${basePath}INSTRUMENT5_1.png`" />
        </div>
        <div :class="`${!game.ballad ? 'greyed' : ''}`">
            <img :src="`${basePath}SONG1_1.png`" />
        </div>
        <div :class="`${!game.mambo ? 'greyed' : ''}`">
            <img :src="`${basePath}SONG2_1.png`" />
        </div>
        <div :class="`${!game.song ? 'greyed' : ''}`">
            <img :src="`${basePath}SONG3_1.png`" />
        </div>
        <div :class="`${!game.instrument6 ? 'greyed' : ''}`">
            <img :src="`${basePath}INSTRUMENT6_1.png`" />
        </div>
        <div :class="`${!game.tailkey ? 'greyed' : ''}`">
            <img :src="`${basePath}TAIL_KEY_1.png`" />
        </div>
        <div :class="`${!game.anglerkey ? 'greyed' : ''}`">
            <img :src="`${basePath}ANGLER_KEY_1.png`" />
        </div>
        <div :class="`${!game.facekey ? 'greyed' : ''}`">
            <img :src="`${basePath}FACE_KEY_1.png`" />
        </div>
        <div :class="`${!game.instrument7 ? 'greyed' : ''}`">
            <img :src="`${basePath}INSTRUMENT7_1.png`" />
        </div>
        <div :class="`${!game.birdkey ? 'greyed' : ''}`">
            <img :src="`${basePath}BIRD_KEY_1.png`" />
        </div>
        <div :class="`${!game.slimekey ? 'greyed' : ''}`">
            <img :src="`${basePath}SLIME_KEY_1.png`" />
        </div>
        <div :class="`${!game.rooster ? 'greyed' : ''}`">
            <img :src="`${basePath}ROOSTER_1.png`" />
        </div>
        <div :class="`${!game.instrument8 ? 'greyed' : ''}`">
            <img :src="`${basePath}INSTRUMENT8_1.png`" />
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

        basePath = '/bundles/restream-layouts/static/tracker/ladxr/'

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
    }

    .greyed {
        filter: opacity(25%);
    }

    /* Number on Item */
    .Leaf {
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
        /*-webkit-text-stroke: 1px white;*/
        font-weight: bold;
    }

    img {
        width: 35px;
        justify-self: center;
    }
</style>
