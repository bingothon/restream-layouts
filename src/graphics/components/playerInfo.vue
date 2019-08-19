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
    <div class="PlayerName">
      <transition name="fade">
        <text-fit :key="text" :text="text">
        </text-fit>
        <!--<div :key="text">
          <span>{{ text }}</span>
        </div>-->
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
    <div v-if="bingoColorShown === true" class="BingoColor FlexContainer" :class="`bingo-${bingoColor}`">
      <span v-if="bingoCountShown === true">{{bingoGoalCount}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { store } from "../../browser-util/state";
import { RunDataPlayer } from "../../../speedcontrol-types";
import TextFit from "../helpers/text-fit.vue";

const playerSoloImg = require('../_misc/player-solo.png');
const twitchIconImg = require('../_misc/twitch-icon.png');

@Component({
  components: {
    TextFit,
  }
})
export default class PlayerInfo extends Vue {
  @Prop({required: true})
  player: RunDataPlayer;

  @Prop({required: true})
  playerIndex: number;

  @Prop({default: true})
  showFlag: boolean;

  @Prop({default: true})
  showColor: boolean;

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
    return store.state.bingoboardMeta.playerColors[this.playerIndex] || "red";
  }

  get bingoGoalCount(): number {
    return store.state.bingoboardMeta.colorCounts[store.state.bingoboardMeta.playerColors[this.playerIndex] || "red"];
  }

  get bingoColorShown(): boolean {
    return store.state.bingoboardMeta.colorShown && this.showColor;
  }

  get bingoCountShown(): boolean {
    return store.state.bingoboardMeta.countShown;
  }
}
</script>

<style>
  .PlayerInfoBox {
    background-image: linear-gradient(#0b1b1d, #23575e);
    color: var(--font-color);
    padding: 7px;
    font-weight: 500;
    font-size: 30px;
    height: 55px;
  }

  .PlayerInfoBox > .CurrentIcon {
    height: 100%;
    width: 80px;
    text-align: left;
    position: relative;
  }

  .PlayerInfoBox > .CurrentIcon > img {
    height: 100%;
    position: absolute;
    filter: invert(1);
  }

  .PlayerInfoBox > .PlayerName {
    flex-grow: 1;
    flex-shrink: 0;
    height: 100%;
    justify-content: flex-start;
    position: relative;
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

  .PlayerInfoBox > .Flag > img {
    visibility: visible;
    position: absolute;
    border: 1px solid white;
    height: calc(100% - 2px);
  }

  .PlayerInfoBox > .BingoColor {
    justify-content: center;
    height: 55px;
    width: 55px;
    margin-left: 29px;
    font-size: 40px;
    border-radius: 10%;
    border: 1px white solid;
  }

  /* Bingosync styled gradients */
  .PlayerInfoBox > .BingoColor.bingo-green {
    background-image: linear-gradient(#31D814, #00B500 60%, #20A00A);
  }

  .PlayerInfoBox > .BingoColor.bingo-red {
    background-image: linear-gradient(#FF4944, #DA4440 60%, #CE302C);
  }

  .PlayerInfoBox > .BingoColor.bingo-orange {
    background-image: linear-gradient(#FF9C12, #F98E1E 60%, #D0800F);
  }

  .PlayerInfoBox > .BingoColor.bingo-blue {
    background-image: linear-gradient(#409CFF, #37A1DE 60%, #088CBD);
  }

  .PlayerInfoBox > .BingoColor.bingo-purple {
    background-image: linear-gradient(#822dbf, #7120ab);
  }

  .PlayerInfoBox > .BingoColor.bingo-pink {
    background-image: linear-gradient(#ed86aa, #cc6e8f);
  }

  .PlayerInfoBox > .BingoColor.bingo-brown {
    background-image: linear-gradient(#ab5c23, #6d3811);
  }

  .PlayerInfoBox > .BingoColor.bingo-teal {
    background-image: linear-gradient(#419695, #2e7372);
  }

  .PlayerInfoBox > .BingoColor.bingo-navy {
    background-image: linear-gradient(#0d48b5, #022b75);
  }

  .PlayerInfoBox > .BingoColor.bingo-yellow {
    background-image: linear-gradient(#d8d014, #c1ba0b);
  }
</style>
