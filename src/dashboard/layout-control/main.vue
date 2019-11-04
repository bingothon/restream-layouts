<template>
  <div id="App">
    Game Layout:
    <select
      v-model="selectedLayoutName"
    >
      <option
        v-for="(layout,i) in allGameLayouts"
        :key="i"
        :value="layout.name"
      >
        {{ layout.name }}
      </option>
    </select>
    <button v-on:click="updateCurrentLayout">Update Layout</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { nodecg, NodeCG } from '../../browser-util/nodecg';
import { Bingoboard, BingosyncSocket, BingoboardMeta, AllGameLayouts, CurrentGameLayout } from '../../../schemas';
import { store, getReplicant } from '../../browser-util/state';


@Component({})
export default class LayoutControl extends Vue {

    selectedLayoutName: string = "";

    mounted() {
      this.selectedLayoutName = this.currentGameLayout.name;
    }
    
    get allGameLayouts(): AllGameLayouts {
      return store.state.allGameLayouts;
    }

    get currentGameLayout(): CurrentGameLayout {
      return store.state.currentGameLayout;
    }

    updateCurrentLayout() {
      const newLayout = this.allGameLayouts.find(l => l.name = this.selectedLayoutName);
      if (!newLayout) {
        throw new Error("The layout selected is invalid, that shouldn't happen!");
      }
      getReplicant<CurrentGameLayout>('currentGameLayout').value = newLayout;
    }
}
</script>

<style>

</style>
