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
      id="ReaderAndMusic"rm
    >
      <!--<reader></reader>
      <music></music>-->
    </info-storage-box>
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
/*import CutBackground from '../_misc/cut_bg';
import Music from './components/Music.vue';
import Reader from './components/Reader.vue';
*/

const curRunRep = nodecg.Replicant('RunDataActiveRun', 'nodecg-speedcontrol');

@Component({
    components: {
        Logo,
        Rotation,
        RunUpcoming,
		InfoStorageBox
      /*SponsorLogos,
      InfoStorageBox,
      Capture,
      Music,
      Reader,
      ,
      AdTimer,*/
    },
})

export default class Intermission extends Vue{
  @Prop({default: undefined})
  data;

  @Prop({default: undefined})
  nextRun: RunData;

  created() {
    nodecg.listenFor('forceRefreshIntermission', this.refreshUpcomingRun);
  }

  refreshUpcomingRun() {
      const curRun = store.state.runDataActiveRun;
	  const nextRun = store.state.runDataArray[curRun.id + 1];
	  if (nextRun) {
	      this.nextRun = nextRun;
	  }
  }
};
</script>

<style>
  .Logo {
    left: 53px;
    top: 43px;
    width: 609px;
    height: 276px;
  }
  #SponsorLogo {
    left: 26px;
    top: 741px;
    width: 662px;
    height: 259px;
  }
  #IntermissionCamera {
    justify-content: flex-end;
    align-items: flex-end;
    left: 30px;
    top: 370px;
    width: 655px;
    height: 368px;
  }
  #ComingUpNext {
    position: fixed;
    left: 718px;
    top: 31px;
    width: 1172px;
    height: 199px;
  }
  #Rotation {
    left: 718px;
    top: 240px;
    width: 1172px;
    height: 660px;
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
</style>
