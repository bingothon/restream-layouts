<template>
	<div id="App">
		<bingo-board style="width:500px;height:500px;position:absolute" fontSize="30px"></bingo-board>
	</div>
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
</template>

<script lang="ts">
	import Vue from 'vue';
	import BingoBoard from "./components/bingoboard.vue";
	import PlayerContainer from "./components/playerContainer.vue";
	import PlayerInfo from "./components/playerInfo.vue"

export default Vue.extend({
  name: 'Example',
  components: {
	  "bingo-board": BingoBoard,
	  "player-container": PlayerContainer
  },
  data() {
    return {
      text: 'Example',
    };
  },
});
</script>

<style>
  #App {
    color: green;
  }
</style>
