<template>
  <div>
    <div v-if="obsConnectionStatus == 'disconnected'">
      Currently disconnected :(
    </div>
    <div v-if="obsConnectionStatus == 'error'">
      OBS connection error monkaS
    </div>
    <div v-if="obsConnectionStatus == 'disabled'">
      OBS is disabled, nothing to see here
    </div>
    <div v-if="obsConnectionStatus == 'connected'">
      Current Scene: {{currentScene}}
      <select v-model="previewScene">
        <option
          v-for="(scene, i) in sceneNameList"
          :key="i"
          :value="scene"
        >{{scene}}</option>
      </select>
      <div
        v-for="(audio, i) in obsAudioSources"
        :key="i"
      >{{audio[0]}}:
        <input
          @change="updateAudioSourceBaseVolume(audio[0],$event)"
          :value="audio[1].baseVolume*100" type="range">
        <button
          @click="toggleAudioFade(audio[0])"
          :disabled="!canTriggerAudioFade(audio[1].fading)"
        >{{toggleAudioFadeText(audio[1].fading)}}</button>
      </div>
      <div>
        <div>
          <input type="checkbox" v-model="discordAudioDelaySync"> Sync discord audio with stream leader delay
        </div>
        <div v-if="!discordAudioDelaySync">
          Discord audio delay (in ms): <input type="number" v-model="discordAudioDelay">
        </div>
        <div>
          <input type="checkbox" v-model="discordDisplayDelaySync"> Sync discord display with stream leader delay
        </div>
        <div v-if="!discordDisplayDelaySync">
          Discord display delay (in ms): <input type="number" v-model="discordDisplayDelay">
        </div>
      </div>
      <button @click="doTransition">Transition</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { nodecg, NodeCG } from '../../browser-util/nodecg';
import { Bingoboard, BingosyncSocket, BingoboardMeta, CurrentMainBingoboard, ObsAudioSources, ObsDashboardAudioSources, DiscordDelayInfo } from '../../../schemas';
import { store, getReplicant } from '../../browser-util/state';

const bundleName = "bingothon-layouts";

@Component({})
export default class OBSControl extends Vue {
    get obsConnectionStatus(): string {
      return store.state.obsConnection.status;
    }
    get currentScene(): string {
      return store.state.obsCurrentScene;
    }
    get previewScene(): string {
      return store.state.obsPreviewScene;
    }
    set previewScene(scene: string) {
      getReplicant('obsPreviewScene').value = scene;
    }
    get obsAudioSources(): [string, any][] {
      return Object.entries(store.state.obsDashboardAudioSources);
    }
    updateAudioSourceBaseVolume(audioSource: string, $event: any) {
      getReplicant<ObsDashboardAudioSources>('obsDashboardAudioSources').value[audioSource].baseVolume = parseInt($event.target.value)/100;
    }
    get sceneNameList(): string[] {
      return store.state.obsSceneList.map(s => s.name);
    }
    get discordAudioDelay(): string {
      return ''+store.state.discordDelayInfo.discordAudioDelayMs;
    }
    set discordAudioDelay(delay: string) {
      getReplicant<DiscordDelayInfo>('discordDelayInfo').value.discordAudioDelayMs = parseInt(delay);
    }
    get discordAudioDelaySync(): boolean {
      return store.state.discordDelayInfo.discordAudioDelaySyncStreamLeader;
    }
    set discordAudioDelaySync(sync: boolean) {
      getReplicant<DiscordDelayInfo>('discordDelayInfo').value.discordAudioDelaySyncStreamLeader = sync;
    }
    get discordDisplayDelay(): string {
      return ''+store.state.discordDelayInfo.discordDisplayDelayMs;
    }
    set discordDisplayDelay(delay: string) {
      getReplicant<DiscordDelayInfo>('discordDelayInfo').value.discordDisplayDelayMs = parseInt(delay);
    }
    get discordDisplayDelaySync(): boolean {
      return store.state.discordDelayInfo.discordDisplayDelaySyncStreamLeader;
    }
    set discordDisplayDelaySync(sync: boolean) {
      getReplicant<DiscordDelayInfo>('discordDelayInfo').value.discordDisplayDelaySyncStreamLeader = sync;
    }
    doTransition() {
      nodecg.sendMessageToBundle('obs:transition', bundleName);
    }
    toggleAudioFade(source: string) {
      if (store.state.obsDashboardAudioSources[source].fading == "muted") {
        nodecg.sendMessageToBundle('obsRemotecontrol:fadeInAudio', bundleName, {source});
      } else {
        nodecg.sendMessageToBundle('obsRemotecontrol:fadeOutAudio', bundleName, {source});
      }
    }
    toggleAudioFadeText(fade: string): string {
      switch(fade) {
        case "fadein": return "Fading in...";
        case "fadeout": return "Fading out...";
        case "muted": return "Unmute";
        case "unmuted": return "Mute";
      }
    }
    canTriggerAudioFade(fade: string): boolean {
      return ["muted","unmuted"].includes(fade);
    }
}
</script>

<style>
  .error-warning {
    color: red;
    font-size: small;
  }
</style>
