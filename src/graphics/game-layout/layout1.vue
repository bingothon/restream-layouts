<template>
	<div id="App">

		<bingo-board style="width:500px;height:500px;" fontSize="30px"></bingo-board>
		<test-game-container></test-game-container>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop } from "vue-property-decorator";
	import { nodecg, NodeCG } from "../../browser-util/nodecg";
	import { Bingoboard, BingosyncSocket, BingoboardMeta } from "../../../schemas";
	import { store, getReplicant } from "../../browser-util/state";

	import TestGameContainer from "../components/testGameContainer.vue";
	import BingoBoard from "../components/bingoboard.vue";

	@Component({
		components: {
			BingoBoard,
			TestGameContainer,
		}
	})
	
	export default class GameLayout extends Vue {
	}
</script>

<style>
  #InfoStorageBox1 {
    left: 626px;
    top: 0px;
    width: 668px;
    height: 308px;
  }
  .PlayerContainer {
    width: 580px;
  }
  .PlayerContainer >>> .PlayerInfoBox {
    height: 40px;
    font-size: 25px;
  }
  #PlayerContainer1, #PlayerContainer3 {
    margin-right: 88px;
  }
  #PlayerContainer2, #PlayerContainer4 {
    margin-top: 3px;
    margin-left: 88px;
  }
  #InfoStorageBox2 {
    left: 626px;
    top: 633px;
    width: 668px;
    height: 307px;
  }
</style>
