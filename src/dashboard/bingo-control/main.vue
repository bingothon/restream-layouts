<template>
  <div id="App">
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
    //connectActionText: string = "[init]";

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

    connectAction() {
        nodecg.sendMessage("bingosync:joinRoom", {roomCode: this.roomCode, passphrase: this.passphrase});
    }
}
</script>

<style>

</style>
