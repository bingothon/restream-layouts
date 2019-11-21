<template>
  <div>
    Current Scene: {{currentScene}}
    <select v-model="previewScene">
      <option
        v-for="(scene, i) in sceneNameList"
        :key="i"
        :value="scene"
      >{{scene}}</option>
    </select>
    <div>Streams Audio:<input v-model="streamsVolume" type="range"><button @click="toggleMuteStreams">{{streamsMuted?"Unmute":"Mute"}}</button></div>
    <div>Discord Audio:<input v-model="discordVolume" type="range"><button @click="toggleMuteDiscord">{{discordMuted?"Unmute":"Mute"}}</button></div>
    <div>MPD Audio:<input v-model="mpdVolume" type="range"><button @click="toggleMuteMpd">{{mpdMuted?"Unmute":"Mute"}}</button></div>
    <button @click="doTransition">Transition</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { nodecg, NodeCG } from '../../browser-util/nodecg';
import { Bingoboard, BingosyncSocket, BingoboardMeta, CurrentMainBingoboard } from '../../../schemas';
import { store, getReplicant } from '../../browser-util/state';
import { ObsSound } from '../../../types';

@Component({})
export default class OBSControl extends Vue {
    get currentScene(): string {
      return store.state.obsCurrentScene;
    }
    get previewScene(): string {
      return store.state.obsPreviewScene;
    }
    set previewScene(scene: string) {
      getReplicant('obsPreviewScene').value = scene;
    }
    get streamsVolume(): string {
      return ''+store.state.obsStreamsSound.volume*100;
    }
    set streamsVolume(vol: string) {
      getReplicant<ObsSound>('obsStreamsSound').value.volume = parseInt(vol)/100;
    }
    get streamsMuted(): boolean {
      return store.state.obsStreamsSound.muted;
    }
    get discordVolume(): string {
      return ''+store.state.obsDiscordSound.volume*100;
    }
    set discordVolume(vol: string) {
      getReplicant<ObsSound>('obsDiscordSound').value.volume = parseInt(vol)/100;
    }
    get discordMuted(): boolean {
      return store.state.obsDiscordSound.muted;
    }
    get mpdVolume(): string {
      return ''+store.state.obsMpdSound.volume*100;
    }
    set mpdVolume(vol: string) {
      getReplicant<ObsSound>('obsMpdSound').value.volume = parseInt(vol)/100;
    }
    get mpdMuted(): boolean {
      return store.state.obsMpdSound.muted;
    }
    get sceneNameList(): string[] {
      return store.state.obsSceneList.map(s => s.name);
    }
    doTransition() {
      nodecg.sendMessageToBundle('obs:transition', 'bingothon-layouts');
    }
    toggleMuteStreams() {
      getReplicant<ObsSound>('obsStreamsSound').value.muted = !store.state.obsStreamsSound.muted;
    }
    toggleMuteDiscord() {
      getReplicant<ObsSound>('obsDiscordSound').value.muted = !store.state.obsDiscordSound.muted;
    }
    toggleMuteMpd() {
      getReplicant<ObsSound>('obsMpdSound').value.muted = !store.state.obsMpdSound.muted;
    }
}
</script>

<style>
  .error-warning {
    color: red;
    font-size: small;
  }
</style>
