<!-- This component handles displays each player's information within a team. -->
<!-- This is added dynamically to the PlayerContainer component when we need to show this. -->
<!-- It is initialised with most info, it only listens to nodecg-speedcontrol for finish times. -->

<template>
  <div
    class="FlexContainer PlayerInfoBox"
  >
    <div class="CurrentIcon">
      <transition name="fade">
        <img
          :key="currentIcon"
          :src="currentIcon"
        >
      </transition>
    </div>
    <div class="PlayerName FlexContainer">
      <transition name="fade">
        <div :key="text">
          <span>{{ text }}</span>
        </div>
      </transition>
    </div>
    <div class="Flag FlexContainer">
      <transition name="fade">
        <img
          :key="player.country"
          :style="{ 'visibility' : showFlag ? 'visbile' : 'hidden' }"
          :src="`/bundles/bingothon-layouts/static/flags/${player.country}.png`"
        >
      </transition>
    </div>
    <div v-if="bingoColorShown" class="BingoColor FlexContainer" :style="{'background-color':bingoColor}">
      {{bingoGoalCount}}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { store } from "../../browser-util/state";
import { RunDataPlayer } from "../../../speedcontrol-types";
import { setInterval } from "timers";

const playerSoloImg = require('../_misc/player-solo.png');
const twitchIconImg = require('../_misc/twitch-icon.png');

@Component({})
export default class PlayerInfo extends Vue {
  @Prop({required: true})
  player: RunDataPlayer;

  @Prop({required: true})
  playerIndex: number;

  @Prop({default: true})
  showFlag: boolean;

  showInterval: NodeJS.Timeout;

  mounted() {

  }

  get show(): boolean {
    return store.state.playerAlternate;
  }

  get currentIcon(): any {
    if (this.show) {
      return playerSoloImg;
    } else {
      return twitchIconImg;
    }
  }

  get text(): string {
    if (this.show) {
      return this.player.name;
    } else {
      return "/"+this.player.social.twitch;
    }
  }

  get bingoColor(): string {
    return store.state.bingoboardMeta.playerColors[this.playerIndex] || "white";
  }

  get bingoGoalCount(): number {
    return store.state.bingoboardMeta.colorCounts[store.state.bingoboardMeta.playerColors[this.playerIndex] || "red"];
  }

  get bingoColorShown(): boolean {
    return store.state.bingoboardMeta.colorShown;
  }
}
</script>

<style>
  .PlayerInfoBox {
    background-color: var(--container-background-color);
    color: var(--font-color);
    padding: 7px;
    font-weight: 500;
    font-size: 30px;
    height: 55px;
  }

  .PlayerInfoBox > .CurrentIcon {
    height: 100%;
    width: 100px;
    text-align: left;
    position: relative;
  }

  .PlayerInfoBox > .CurrentIcon > img {
    height: 100%;
    position: absolute;
    filter: invert(1);
  }

  .PlayerInfoBox > .PlayerName {
    flex: 1;
    justify-content: flex-start;
    position: relative;
  }

  .PlayerInfoBox > .PlayerName > div {
    position: absolute;
  }

  /*.PlayerInfoBox > .PlayerName > div > .FinishTime {
    color: var(--font-colour);
  }*/

  .PlayerInfoBox > .Flag {
    height: 100%;
    width: 100px;
    justify-content: flex-end;
    position: relative;
  }

  .PlayerInfoBox > .Flag {
    height: 100%;
    width: 100px;
    justify-content: flex-end;
    position: relative;
  }

  .PlayerInfoBox > .Flag > img {
    visibility: visible;
    position: absolute;
    border: 1px solid white;
    height: calc(100% - 2px);
  }

  .PlayerInfoBox > .BingoColor {
    justify-content: center;
    height: 100%;
    width: 55px;
    margin-left: 29px;
    font-size: 40px;
  }
</style>
