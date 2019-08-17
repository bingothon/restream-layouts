<template>
	<div>
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

</style>
