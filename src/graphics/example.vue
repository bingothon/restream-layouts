<template>
	<div id="App">
		<bingo-board style="width:500px;height:500px;position:absolute" fontSize="30px"></bingo-board>
	</div>
</template>

<script lang="ts">
	import Vue from 'vue';
	import BingoBoard from "./components/bingoboard.vue";
	import PlayerContainer from "./components/PlayerContainer.vue";
	import PlayerInfo from "./components/PlayerInfo.vue"

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
