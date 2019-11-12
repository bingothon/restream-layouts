<template>
	<div class="Interview">
	<img src="../../../static/logo-winter-wide.png" id="logo">
    <div id="fillcamPE" class="flexContainer"></div>
	<div id="fillcamIVW1" class="flexContainer"></div>
	<div id="infoIVW1" class="flexContainer">
		<div id="nameIVW1">Pikastroff</div>
	</div>
	<div id="fillcamIVW2" class="flexContainer"></div>
	<div id="infoIVW2" class="flexContainer">
		<div id="nameIVW2">Palmy</div>
	</div>
	<div id="info" class="flexContainer">
		<div id="infotext">
			<div id="name"> Jen Marracino </div>
			<div id="occupation"> Senior Director of Development at Pure Earth New York</div>
		</div>
		<div id="pe-logo">
			<img src="../../../static/PE-logo-oulined.png">
		</div>
	</div>
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
		}
	})

	export default class Interview extends Vue {
	}
</script>

<style scoped>
	body{
		background: linear-gradient(var(--darker-main-color), var(--lighter-main-color));
	}
	.Interview {
		position: absolute;
		top: 0px;
		left: 0px;
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
		top: 619px;
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
	  top: 850px;
	  position: absolute;
	  left: 50px;
	  width: 1200px;
	  height: 100px;
	  background-image: linear-gradient(#373d6f, #2a2a54);
	  color: var(--font-color);
  }
  #name {
	  top: 850px;
	  font-size: 60px;
	  margin-left: 10px;
  }
  #occupation {
	  top: 910px;
	  font-size: 20px;
	  margin-left: 10px;
  }
  #infoIVW1 {
	  position: absolute;
	  top: 456px;
	  left: 1300px;
	  height: 50px;
	  width: 500px;
	  background-image: linear-gradient(#373d6f, #2a2a54);
	  color: var(--font-color);
	  font-size: 40px;
  }

  #infoIVW2 {
	  position: absolute;
	  top: 900px;
	  left: 1300px;
	  height: 50px;
	  width: 500px;
	  background-image: linear-gradient(#373d6f, #2a2a54);
	  color: var(--font-color);
	  font-size: 40px;
  }
  #nameIVW1 {
	  margin-left: 10px;
  }
  #nameIVW2 {
	  margin-left: 10px;
  }
  #pe-logo > img {
	  object-fit: contain;
	  height: 100px;
  }
  #pe-logo {
	  position: absolute;
	  left: 800px;
  }
  #infotext {
	  position: absolute;
	  left: 0px;
  }
</style>
