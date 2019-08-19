<template>
  <div id="App">
    <ul>
      <li
        v-for="(count,i) in colorCounts"
        :key="i"
      >
        {{ count["color"] }}:{{ count["count"] }}
      </li>
    </ul>
    <div
      v-for="(color,i) in playerColors"
      :key="i"
    >
      P{{ i }}: <select
        :value="color"
        @change="updatePlayerColor(i, $event)"
      >
        <option
          v-for="(sColor,i) in allColors"
          :key="i"
          :value="sColor"
        >
          {{ sColor }}
        </option>
      </select>
    </div>
    <div>
      Room Code: <input v-model="roomCode">
    </div>
    <div>
      Passphrase: <input v-model="passphrase">
    </div>
    <div>
      <button
        :disabled="!canDoConnectAction"
        @click="connectAction"
      >
        {{ connectActionText }}
      </button>
    </div>
    <div>
      <button @click="toggleCard">
        {{ toggleCardText }}
      </button>
      <button @click="toggleColors">
        {{ toggleColorsText }}
      </button>
      <button @click="toggleCount">
        {{ toggleCountText }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { nodecg, NodeCG } from '../../browser-util/nodecg';
import { Bingoboard, BingosyncSocket, BingoboardMeta } from '../../../schemas';
import { store, getReplicant } from '../../browser-util/state';

type ColorEnum = ('pink' | 'red' | 'orange' | 'brown' | 'yellow' | 'green' | 'teal' | 'blue' | 'navy' | 'purple');

@Component({})
export default class BingoControl extends Vue {
    roomCode: string = '';

    passphrase: string = '';

    allColors = Object.freeze(['pink', 'red', 'orange', 'brown', 'yellow', 'green', 'teal', 'blue', 'navy', 'purple']);

    // --- computed properties
    get connectActionText(): string {
      switch (store.state.bingosyncSocket.status) {
        case 'connected':
          return 'disconnect';
        case 'disconnected':
          return 'connect';
        case 'connecting':
          return 'connecting...';
        case 'error':
          return 'ERROR!';
      }
    }

    get toggleCardText(): string {
      if (store.state.bingoboardMeta.boardHidden) {
        return 'Show Card';
      }
      return 'Hide Card';
    }

    get toggleColorsText(): string {
      if (store.state.bingoboardMeta.colorShown) {
        return 'Hide Colors';
      }
      return 'Show Colors';
    }

    get toggleCountText(): string {
      if (store.state.bingoboardMeta.countShown) {
        return 'Hide Goalcount';
      }
      return 'Show Goalcount';
    }

    get playerColors(): Array<ColorEnum> {
      return store.state.bingoboardMeta.playerColors;
    }

    get canDoConnectAction(): boolean {
      switch (store.state.bingosyncSocket.status) {
        case 'connected':
          return true;
        case 'disconnected':
          return (!!this.roomCode && !!this.passphrase);
        case 'connecting':
        case 'error':
          return false;
      }
    }

    // test
    get colorCounts(): Array<{color: string, count: number}> {
      const counts = store.state.bingoboardMeta.colorCounts;
      const countArray = [];
      for (const key in counts) {
        if (counts.hasOwnProperty(key)) {
          const element = counts[key];
          if (element > 0) {
            countArray.push({ color: key, count: element });
          }
        }
      }
      return countArray;
    }

    // --- handlers

    connectAction() {
      switch (store.state.bingosyncSocket.status) {
        case 'connected':
          nodecg.sendMessage('bingosync:leaveRoom');
          return;
        case 'disconnected':
          nodecg.sendMessage('bingosync:joinRoom', { roomCode: this.roomCode, passphrase: this.passphrase });
      }
    }

    updatePlayerColor(idx: number, evt: any) {
      getReplicant<BingoboardMeta>('bingoboardMeta').value.playerColors[idx] = evt.target.value;
    }

    toggleCard() {
      getReplicant<BingoboardMeta>('bingoboardMeta').value.boardHidden = !store.state.bingoboardMeta.boardHidden;
    }

    toggleColors() {
      getReplicant<BingoboardMeta>('bingoboardMeta').value.colorShown = !store.state.bingoboardMeta.colorShown;
    }

    toggleCount() {
      getReplicant<BingoboardMeta>('bingoboardMeta').value.countShown = !store.state.bingoboardMeta.countShown;
    }
}
</script>

<style>

</style>
