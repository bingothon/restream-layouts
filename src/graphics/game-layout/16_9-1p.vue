<template>
	<div>
    <div id="fillur" class="flexContainer"></div>
    <div id="fillbar" class="flexContainer"></div>
    <div id="fillvoice" class="flexContainer"></div>
    <player-info id="pi1" :player="teams[0].players[0]" playerIndex="0" height=45px></player-info>
		<test-game-container id="game"></test-game-container>
    <test-timer-container id="timer"></test-timer-container>
    <bingo-board id="Bingo-board" fontSize="30px"></bingo-board>
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
  #fillur {
    position: absolute;
    top: 0px;
    left: 400px;
    width: 1520px;
    height: 855px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px blue solid;
  }
  #fillbar {
    position: absolute;
    top: 1000px;
    left: 0px;
    width: 1920px;
    height: 80px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px blue solid;
  }
  #fillvoice {
    position: absolute;
    top: 560px;
    left: 0px;
    width: 400px;
    height: 440px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px blue solid;
  }
  #pi1 {
    position: absolute;
    top: 0px;
    left: 0px;
    border: 2px blue solid;
    width: 382px;
  }
  #Bingo-board {
    position: absolute;
    top: 60px;
    left: 0px;
    border: 2px blue solid;
    width: 400px;
    height: 500px;
  }
  #game {
    background-image: url("../../../static/middle-info-background.png");
    position: absolute;
    top: 855px;
    left: 400px;
    width: 760px;
    border: 2px blue solid;
    height: 145px;
  }
  #timer{
    position: absolute;
    top: 855px;
    left: 1160px;
    background-image: url("../../../static/middle-info-background.png");
    width: 760px;
    border: 2px blue solid;
    height: 145px;
  }
</style>
