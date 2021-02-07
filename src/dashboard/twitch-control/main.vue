<template>
    <div>
        <div>
            <div
                v-for="(stream, i) in twitchStreams"
                :key="i"
                class="stream-control"
            >
                <span class="stream-label">Player {{ i }}:</span>
                <v-btn
                    class="stream-mute"
                    dark
                    small
                    @click="muteChange(i)"
                >
                    <v-icon v-if="i == soundOnTwitchStream">
                        mdi-volume-off
                    </v-icon>
                    <v-icon v-else>
                        mdi-volume-high
                    </v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {nodecg} from '../../browser-util/nodecg';
import {TwitchStreams,} from '../../../schemas';
import {getReplicant, store} from '../../browser-util/state';

const bingothonBundleName = 'bingothon-layouts';

@Component({})
export default class TwitchControl extends Vue {
    twitchChannelOverrides: string[] = ['', '', '', ''];

    get twitchStreams(): TwitchStreams {
        return store.state.twitchStreams;
    }

    get soundOnTwitchStream(): number {
        return store.state.soundOnTwitchStream;
    }

    get game(): string {
        return store.state.gameMode.game;
    }

    volumeChange(id: number, event: any) {
        const newVolume = parseInt(event.target.value, 10) / 100;
        nodecg.sendMessageToBundle('streams:setStreamVolume', bingothonBundleName, {id, volume: newVolume});
    }

    updateStreamQuality(id: number, event: any) {
        nodecg.sendMessageToBundle('streams:setStreamQuality', bingothonBundleName, {id, quality: event.target.value});
    }

    muteChange(id: number) {
        if (this.soundOnTwitchStream === id) {
            nodecg.sendMessageToBundle('streams:setSoundOnTwitchStream', bingothonBundleName, -1);
        } else {
            nodecg.sendMessageToBundle('streams:setSoundOnTwitchStream', bingothonBundleName, id);
        }
    }

    togglePlayPause(id: number) {
        nodecg.sendMessageToBundle('streams:toggleStreamPlayPause', bingothonBundleName, id);
    }

    refresh(id: number) {
        nodecg.sendMessageToBundle('streams:refreshStream', bingothonBundleName, id);
    }

    overrideChannelName(id: number) {
        getReplicant<TwitchStreams>('twitchStreams').value[id].channel = this.twitchChannelOverrides[id];
    }
}
</script>

<style>
.stream-control {
    padding: 5px;
}

.override-button > .v-btn {
    width: 100%;
}

</style>
