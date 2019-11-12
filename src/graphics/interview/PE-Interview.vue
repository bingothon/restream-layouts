<template>
	<div class="Interview">
	<img src="../../../static/logo-winter-wide.png" id="logo">
    <div id="fillcamPE" class="flexContainer"></div>
	<div id="fillcamIVW1" class="flexContainer"></div>
	<div id="fillcamIVW2" class="flexContainer"></div>
	<div id="info" class="flexContainer">
		<div id="name"> Jen Marracino </div>
		<div id="occupation"> Senior Director of Development at Pure Earth New York</div>
	</div>
	<test-timer-container id="timer"></test-timer-container>
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
		width: 1920px;
		height: 1080px;
		background: linear-gradient(var(--darker-main-color), var(--lighter-main-color));
	}
  #fillcamPE {
    position: absolute;
    top: 175px;
    left: 50px;
    width: 1200px;
    height: 675px;
	background-color: var(--container-background-color);
  }

  #fillcamIVW1 {
		position: absolute;
		top: 175px;
		left: 1300px;
		width: 500px;
		height: 281px;
		background-color: var(--container-background-color);
	}

	#fillcamIVW2 {
		position: absolute;
		top: 500px;
		left: 1300px;
		width: 500px;
		height: 281px;
		background-color: var(--container-background-color);
	}

  #logo{
	  position: absolute;
	  left: 650px;
	  top: -30px;
	  width: 666px;
	  height: 200px;
  }
  #info {
	  position: absolute;
	  top: 850px;
	  left: 50px;
	  width: 1200px;
	  height: 100px;
	  background-image: linear-gradient(#5C88BC, #315091);
	  color: var(--font-color);
  }
  #name {
	  font-size: 60px;
  }
  #occupation {
	  font-size: 20px;
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
    top: 850px;
    left: 1300px;
    background-color: var(--container-background-color);
    width: 500px;
    height: 150px;
  }
</style>
