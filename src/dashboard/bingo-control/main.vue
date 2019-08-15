<template>
  <div id="App">
      <ul>
          <li v-for="(count,i) in colorCounts" v-bind:key="i">
              {{count["color"]}}:{{count["count"]}}
          </li>
      </ul>
      <div v-for="(color,i) in playerColors" :key="i">
          P{{i}}: <select v-bind:value="color" @change="updatePlayerColor(i, $event)">
              <option v-for="(sColor,i) in allColors" :key="i" :value="sColor">{{sColor}}</option>
          </select>
      </div>
      <div>
        Room Code: <input v-model="roomCode">
      </div>
      <div>
        Passphrase: <input v-model="passphrase">
      </div>
      <div>
          <button @click="connectAction" v-bind:disabled="!canDoConnectAction">{{connectActionText}}</button>
      </div>
      <div><button @click="toggleCard">{{toggleCardText}}</button><button @click="toggleColors">{{toggleColorsText}}</button></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { nodecg, NodeCG } from "../../browser-util/nodecg";
import { Bingoboard, BingosyncSocket, BingoboardMeta } from "../../../schemas";
import { store, getReplicant } from "../_misc/state";

type ColorEnum = ("pink" | "red" | "orange" | "brown" | "yellow" | "green" | "teal" | "blue" | "navy" | "purple");

@Component({})
export default class BingoControl extends Vue {
    roomCode: string = "";
    passphrase: string = "";
    allColors = Object.freeze(["pink", "red", "orange", "brown", "yellow", "green", "teal", "blue", "navy", "purple"]);

    // --- computed properties
    get connectActionText(): string {
        switch (store.state.bingosyncSocket.status) {
            case "connected":
                return "disconnect";
            case "disconnected":
                return "connect";
            case "connecting":
                return "connecting...";
            case "error":
                return "ERROR!";
        }
    }

    get toggleCardText(): string {
        if (store.state.bingoboardMeta.boardHidden) {
            return "Show Card";
        } else {
            return "Hide Card";
        }
    }

    get toggleColorsText(): string {
        if (store.state.bingoboardMeta.colorShown) {
            return "Hide Colors";
        } else {
            return "Show Colors";
        }
    }

    get playerColors(): Array<ColorEnum> {
        return store.state.bingoboardMeta.playerColors;
    }

    get canDoConnectAction(): boolean {
        switch (store.state.bingosyncSocket.status) {
            case "connected":
                return true;
            case "disconnected":
                return (!!this.roomCode && !!this.passphrase);
            case "connecting":
            case "error":
                return false;
        }
    }

    // test
    get colorCounts(): Array<{color: string, count: number}> {
        let counts = store.state.bingoboardMeta.colorCounts;
        let countArray = [];
        for (const key in counts) {
            if (counts.hasOwnProperty(key)) {
                const element = counts[key];
                if (element > 0) {
                    countArray.push({color: key, count: element});
                }
            }
        }
        return countArray;
    }

    // --- handlers

    connectAction() {
        switch (store.state.bingosyncSocket.status) {
            case "connected":
                nodecg.sendMessage("bingosync:leaveRoom");
                return;
            case "disconnected":
                nodecg.sendMessage("bingosync:joinRoom", {roomCode: this.roomCode, passphrase: this.passphrase});
                return;
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
}
</script>

<style>

</style>
