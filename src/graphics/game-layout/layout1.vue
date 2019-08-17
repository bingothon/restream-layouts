<template>
	<div id="App">
		<bingo-board style="width:500px;height:500px;position:absolute" fontSize="30px"></bingo-board>
	<info-storage-box id="InfoStorageBox1">
		<commentators></commentators>
		<div id="GameInfo"
			 class="FlexContainer">
			<game-name></game-name>
			<game-extra-info></game-extra-info>
			<timer></timer>
		</div>
		<player-container id="PlayerContainer1"
						  :team-index="0"
						  single></player-container>
		<player-container id="PlayerContainer2"
						  :team-index="1"
						  single></player-container>
	</info-storage-box>

	<info-storage-box id="InfoStorageBox2">
		<player-container id="PlayerContainer3"
						  :team-index="2"
						  single></player-container>
		<player-container id="PlayerContainer4"
						  :team-index="3"
						  single></player-container>
		</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop } from "vue-property-decorator";
	import { nodecg, NodeCG } from "../../browser-util/nodecg";
	import { Bingoboard, BingosyncSocket, BingoboardMeta } from "../../../schemas";
	import { store, getReplicant } from "../../browser-util/state";
	import PlayerContainer from "../components/playerContainer.vue";
	import PlayerInfo from "../components/playerInfo.vue";

	@Component({})
	export default class GameLayout extends Vue {
		components: {
			PlayerContainer,
			InfoStorageBox,
  		}
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
