<template>
  <div id="App">
      Hello World
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { nodecg, NodeCG } from "../../browser-util/nodecg";
import { Bingoboard, BingosyncSocket, BingoboardMeta } from "../../../schemas";
import { store, getReplicant } from "../../browser-util/state";

@Component({})
export default class GameLayout extends Vue {

}
</script>

<style>

</style>
