<template>
	<div>
    <div id="fillleft" class="flexContainer"></div>
    <player-team-container id="ptc1" teamIndex="0" style="width:600px;"></player-team-container>
		<test-game-container id="game"></test-game-container>
    <test-timer-container id="timer"></test-timer-container>
    <bingo-board id="bingo" style="width:500px;height:500px;" fontSize="30px"></bingo-board>
    <player-team-container id="ptc2" teamIndex="1" style="width:600px;"></player-team-container>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop } from "vue-property-decorator";
	import { nodecg, NodeCG } from "../../browser-util/nodecg";
	import { Bingoboard, BingosyncSocket, BingoboardMeta } from "../../../schemas";
	import { store, getReplicant } from "../../browser-util/state";
  import TestTimerContainer from "../components/testTimerContainer.vue";
	import TestGameContainer from "../components/testGameContainer.vue";
  import BingoBoard from "../components/bingoboard.vue";
  import PlayerInfo from "../components/playerInfo.vue";
  import TeamInfo from "../components/teamInfo.vue";
  import PlayerTeamContainer from "../components/playerTeamContainer.vue";
  import { RunDataPlayer, RunDataTeam } from "../../../speedcontrol-types";

	@Component({
		components: {
			BingoBoard,
      TestGameContainer,
      PlayerInfo,
      TeamInfo,
      PlayerTeamContainer,
      TestTimerContainer,
		}
	})
	
	export default class GameLayout extends Vue {
    get teams(): RunDataTeam[] {
      return store.state.runDataActiveRun.teams;
    }
	}
</script>

<style scoped>
  #InfoStorageBox1 {
    position: absolute;
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
    position: absolute;
    left: 626px;
    top: 633px;
    width: 668px;
    height: 307px;
  }
  #ptc1 {
    position: absolute;
    top: 0px;
    left: 660px;
  }
  #ptc2 {
    position: absolute;
    top: 860px;
    left: 660px;
  }
  #bingo {
    position: absolute;
    top: 360px;
    left: 710px;
  }
  #game {
    background: grey;
    position: absolute;
    top: 220px;
    left: 660px;
  }
  #fillleft {
    position: absolute;
    top: 0px;
    height: 1080px;
    left: 0px;
    width: 660px;
    background-color: gray;
  }
  #timer{
    position: absolute;
    top: 320px;
    left: 660px;
    background-color: gray;
  }
</style>
