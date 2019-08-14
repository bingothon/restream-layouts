<template>
  <div id="App">
      <ul>
          <li v-for="(count,i) in colorCounts" v-bind:key="i">
              {{count["color"]}}:{{count["count"]}}
          </li>
      </ul>
      <div>
        Room Code: <input v-model="roomCode">
      </div>
      <div>
        Passphrase: <input v-model="passphrase">
      </div>
      <div>
          <button @click="connectAction" v-bind:disabled="!canDoConnectAction">{{connectActionText}}</button>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { nodecg, NodeCG } from "../../browser-util/nodecg";
import { Bingoboard, BingosyncSocket } from "../../../schemas";
import { store } from "../state/state";

@Component({})
export default class BingoControl extends Vue {
    roomCode: string = "";
    passphrase: string = "";

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
}
</script>

<style>

</style>
