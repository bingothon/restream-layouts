<template>
	<div class="Interview">
	<img src="../../../static/logo-winter-wide.png" id="logo">
    <div id="fillvoice" class="flexContainer"></div>
    <player-info id="pi1" playerIndex="0" height=45px></player-info>
		<test-game-container id="game"></test-game-container>
    <test-timer-container id="timer"></test-timer-container>
    <bingo-board id="Bingo-board" fontSize="20px"></bingo-board>
    <discord-voice-display id="discord-voice" iconHeight="40px" nameWidth="114px"/>
	<test-next-game-container id="nextGame"></test-next-game-container>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
  import TestTimerContainer from "../components/testTimerContainer.vue";
	import TestGameContainer from "../components/testGameContainer.vue";
  import BingoBoard from "../components/bingoboard.vue";
  import PlayerInfo from "../components/playerInfo.vue";
  import TeamInfo from "../components/teamInfo.vue";
  import PlayerTeamContainer from "../components/playerTeamContainer.vue";
  import DiscordVoiceDisplay from "../components/discordVoiceDisplay.vue";

	@Component({
		components: {
			BingoBoard,
      TestGameContainer,
      PlayerInfo,
      TeamInfo,
      PlayerTeamContainer,
      TestTimerContainer,
      DiscordVoiceDisplay,
		}
	})

	export default class Interview extends Vue {
	}
</script>

<style scoped>
	.Interview {
		position: absolute;
		left: 0px;
		top: 0px;
		width: 1935px;
		height: 1090px;
		background: linear-gradient(var(--darker-main-color), var(--lighter-main-color));
	}
  #discord-voice {
    position: absolute;
    top: 920px;
    left: 460px;
    width: 1000px;
    height: 80px;
	  background-color: var(--container-background-color);
  }
  #logo{
	  position: absolute;
	  left: 650px;
	  top: -30px;
	  width: 666px;
	  height: 200px;
  }
  #pi1 {
    position: absolute;
    top: 500px;
    left: 0px;
    width: 500px;
  }
  #Bingo-board {
    position: absolute;
    top: 410px;
    left: 710px;
    width: 500px;
    height: 500px;
  }
  #game {
    background-color: var(--container-background-color);
    position: absolute;
    top: 150px;
    left: 460px;
    width: 1000px;
    height: 100px;
  }
  #timer{
    position: absolute;
    top: 250px;
    left: 710px;
    background-color: var(--container-background-color);
    width: 500px;
    height: 150px;
  }
</style>
