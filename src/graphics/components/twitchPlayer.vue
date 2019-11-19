<template>
    <div ref="playerContainer" class="TwitchPlayerContainer">
        <div
            ref="twitchPlayer"
            class="TwitchPlayer"
            :style="{'left':`${leftAdjustment}px`,'top':`${topAdjustment}px`,'width':`${playerWidth}px`,'height':`${playerHeight}px`}"
        ></div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { store } from '../../browser-util/state';
import { TwitchStream } from '../../../types';
// included in the main html
// import "https://player.twitch.tv/js/embed/v1.js";

// Twitch isn't advanced enough for type definitions
declare const Twitch: any;

@Component({})
export default class TestGameContainer extends Vue {
    @Prop({required: true})
    streamIndex: number;

    // Twitch Player
    player: any;

    leftAdjustment: number = 0;
    topAdjustment: number = 0;
    playerWidth: number = 0;
    playerHeight: number = 0;

    mounted() {
        this.onCurrentStreamChange(this.currentStream, null);
    }

    createTwitchPlayer() {
        const playerContainer = this.$refs.playerContainer as HTMLElement;
        console.log(playerContainer.clientWidth);
        this.playerWidth = playerContainer.clientWidth * this.currentStream.widthPercent/100;
        this.playerHeight= playerContainer.clientHeight * this.currentStream.heightPercent/100;
        var playerOptions = {
            'channel':  this.currentStream.channel,
            'width':    this.playerWidth,
            'height':   this.playerHeight
        }
        this.player = new Twitch.Player(this.$refs.twitchPlayer, playerOptions);
        this.player.showPlayerControls(false);
    }

    destroyTwitchPlayer() {
        this.player = null;
        // remove the iframe inside the twitchPlayer div
        (this.$refs.twitchPlayer as HTMLElement).innerHTML = '';
    }

    get currentStream(): TwitchStream {
        return store.state.twitchStreams[this.streamIndex];
    }

    // don't watch immedeately, cause then the HTML elements aren't ready
    @Watch('currentStream')
    onCurrentStreamChange(newStream: TwitchStream, oldStream: TwitchStream) {
        nodecg.log.info('stream changed!');
        // check if the player needs to be newly created
        if (!oldStream ||
            newStream.widthPercent != oldStream.widthPercent ||
            newStream.heightPercent != oldStream.heightPercent) {
            if (this.player) {
                this.destroyTwitchPlayer();
            }
            this.createTwitchPlayer();
        }
        const playerContainer = this.$refs.playerContainer as HTMLElement;

        var width = playerContainer.clientWidth * this.currentStream.widthPercent/100;
        var height = playerContainer.clientHeight * this.currentStream.heightPercent/100;
        this.leftAdjustment = width * this.currentStream.leftPercent/100;
        this.topAdjustment = height * this.currentStream.topPercent/100;
        this.player.setVolume(newStream.volume);
        // if this sound is not on mute
        this.player.setMuted(this.streamIndex != store.state.soundOnTwitchStream);
        if (!oldStream || oldStream.quality != newStream.quality) {
            this.player.setQuality(newStream.quality);
        }
        if (!oldStream || oldStream.volume != newStream.volume) {
            this.player.setVolume(newStream.volume);
        }
        if (!oldStream || oldStream.channel != newStream.channel) {
            this.player.setChannel(newStream.channel);
        }
        if (newStream.paused) {
            this.player.pause();
        } else {
            this.player.play();
        }
    }
}
</script>

<style>
    .TwitchPlayerContainer {
        overflow: hidden;
    }

    .TwitchPlayerContainer > .TwitchPlayer {
        position: absolute;
    }
</style>