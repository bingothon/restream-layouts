<template>
  <div id="Intermission">
    <logo></logo>
    <run-upcoming
      v-if="nextRun"
      id="ComingUpNext"
      :data="nextRun"
    ></run-upcoming>
    <rotation></rotation>
    <info-storage-box
      id="ReaderAndMusic"
    >
		<div class="Mic">
			<img src="components/Mic.png">
		</div>
		<DiscordVoiceDisplay voiceHighlightColor="var(--darker-main-color)"></DiscordVoiceDisplay>
      <!--<reader></reader>-->
      <music></music>
    </info-storage-box>
	  <div class="HostingBingo">
		  Hosting Bingo
		  <div class="CardPlaceholder">
		  </div>
	  </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import Logo from './components/Logo.vue';
import Rotation from './components/Rotation.vue';
import {store} from "../../browser-util/state";
import RunUpcoming from "./components/RunUpcoming.vue";
import {RunData} from "../../../speedcontrol-types";
import InfoStorageBox from "../_misc/components/InfoStorageBox.vue";
import DiscordVoiceDisplay from "../components/discordVoiceDisplay.vue";
import Music from './components/Music.vue';
/*import CutBackground from '../_misc/cut_bg';
import Reader from './components/Reader.vue';
*/

@Component({
    components: {
        Logo,
        Rotation,
        RunUpcoming,
		InfoStorageBox,
        Music,
		DiscordVoiceDisplay
      /*SponsorLogos,
      InfoStorageBox,
      Capture,
      Reader,
      ,
      AdTimer,*/
    },
})

export default class Intermission extends Vue{
  @Prop({default: undefined})
  data;

  nextRun: RunData = null;

  created() {
    this.refreshUpcomingRun();
  }

  mounted() {
    nodecg.listenFor('forceRefreshIntermission', this.refreshUpcomingRun);
  }

  refreshUpcomingRun() {
      const curRun = store.state.runDataActiveRun;
	  const nextRun = store.state.runDataArray[this.findRunIndex(curRun) + 1];
	  if (nextRun) {
	      this.nextRun = nextRun;
	  }
  }

    findRunIndex(run : RunData): number {
        let curRunID = run.id;
        if (!curRunID) {
            return -1;
        }
        return store.state.runDataArray.findIndex(run => run.id === curRunID);
    }
};
</script>

<style>
  logo {
	position: absolute;
    left: 10px;
    top: 21px;
  }
  #ComingUpNext {
    position: fixed;
    left: 718px;
    top: 31px;
    width: 1172px;
    height: 199px;
	color: white;
  }
  #Rotation {
    left: 718px;
    top: 240px;
    width: 1172px;
    height: 660px;
	color: white;
  }
  #ReaderAndMusic {
    justify-content: flex-start;
    flex-direction: row;
    background-color: rgba(0,0,0,0.3);
    left: 718px;
    top: 910px;
    width: 1172px;
    height: 60px;
    font-size: 30px;
  }

  .DiscordVoiceDisplay {
	  width: 1172px;
	  left: 750px;
	  top: 920px;
  }
  .Mic {
	  background-color: var(--lighter-main-color);
	  top: 910px;
	  height: 60px;
	  padding: 5px;
  }
  .Mic > img {
	  top: 910px;
	  height: 60px;
	  object-fit: contain;
  }

	body {
		background: linear-gradient(var(--lighter-main-color), var(--darker-main-color));
		/*background-color: rgba(98, 127, 190, 0.5)*/
	}

	.CardPlaceholder {
		position: fixed;
		top: 350px;
		left: 0px;
		height: 650px;
		width: 650px;
		background-color: var(--container-background-color);
	}

	.HostingBingo {
		position: fixed;
		color: white;
		top: 290px;
		height: 750px;
		width: 650px;
		font-size: 50px;
	}
</style>
