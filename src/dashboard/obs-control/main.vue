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
    <div>Streams Audio:<input v-model="streamsVolume" type="range"></div>
    <div>Discord Audio:<input v-model="discordVolume" type="range"></div>
    <div>MPD Audio:<input v-model="mpdVolume" type="range"></div>
    <button @click="doTransition">Transition</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { nodecg, NodeCG } from '../../browser-util/nodecg';
import { Bingoboard, BingosyncSocket, BingoboardMeta, CurrentMainBingoboard } from '../../../schemas';
import { store, getReplicant } from '../../browser-util/state';

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
      return ''+store.state.obsStreamsVolume*100;
    }
    set streamsVolume(vol: string) {
      getReplicant('obsStreamsVolume').value = parseInt(vol)/100;
    }
    get discordVolume(): string {
      return ''+store.state.obsDiscordVolume*100;
    }
    set discordVolume(vol: string) {
      getReplicant('obsDiscordVolume').value = parseInt(vol)/100;
    }
    get mpdVolume(): string {
      return ''+store.state.obsMpdVolume*100;
    }
    set mpdVolume(vol: string) {
      getReplicant('obsMpdVolume').value = parseInt(vol)/100;
    }
    get sceneNameList(): string[] {
      return store.state.obsSceneList.map(s => s.name);
    }
    doTransition() {
      nodecg.log.info('pls?');
      nodecg.sendMessageToBundle('obs:transition', 'bingothon-layouts');
    }
}
</script>

<style>
  .error-warning {
    color: red;
    font-size: small;
  }
</style>
