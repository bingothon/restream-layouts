<template>
  <div>
    <div
      v-for="(stream, i) in twitchStreams"
      :key="i"
    >
      <span class="stream-label">Player {{ i }}:</span>
      <button
        class="stream-mute"
        @click="muteChange(i)"
      >
        {{ i == soundOnTwitchStream?'Mute':'Unmute' }}
      </button>
      <button
        class="stream-refresh"
        @click="refresh(i)"
      >
        Refresh
      </button>
      <button
        class="stream-pause"
        @click="togglePlayPause(i)"
      >
        {{ stream.paused?'Play':'Pause' }}
      </button>
      <select
        :value="stream.quality"
        @change="updateStreamQuality(i, $event)"
      >
        <option
          v-for="(quality,i) in stream.availableQualities"
          :key="i"
          :value="quality.group"
        >
          {{ quality.name }}
        </option>
      </select>
      <div>
        <span>Vol: </span><input
          class="stream-volume"
          type="range"
          min="0"
          max="100"
          :value="stream.volume*100"
          @change="volumeChange(i,$event)"
        >
      </div>
      <div><span>Delay:</span><span class="delay-display">{{ stream.delay }}</span></div>
      <div>
        <input v-model="twitchChannelOverrides[i]"><button @click="overrideChannelName(i)">
          Override stream
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import clone from 'clone';
import { Component, Vue } from 'vue-property-decorator';
import { nodecg, NodeCG } from '../../browser-util/nodecg';
import {
  Bingoboard, BingosyncSocket, BingoboardMeta, AllGameLayouts, CurrentGameLayout, TwitchStreams,
} from '../../../schemas';
import { store, getReplicant } from '../../browser-util/state';

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

  volumeChange(id: number, event: any) {
    const newVolume = parseInt(event.target.value) / 100;
    nodecg.sendMessageToBundle('streams:setStreamVolume', bingothonBundleName, { id, volume: newVolume });
  }

  updateStreamQuality(id: number, event: any) {
    nodecg.sendMessageToBundle('streams:setStreamQuality', bingothonBundleName, { id, quality: event.target.value });
  }

  muteChange(id: number) {
    if (this.soundOnTwitchStream == id) {
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

</style>
