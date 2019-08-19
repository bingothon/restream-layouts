<template>
  <div class="FlexContainer TeamInfoBox">
    <div v-if="bingoColorShown" class="BingoColor FlexContainer" :class="`bingo-${bingoColor}`">
      <span v-if="bingoCountShown">{{bingoGoalCount}}</span>
    </div>
    <div class="TeamNameContainer">Team: {{name}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { RunDataTeam } from "../../../speedcontrol-types";
import { store } from "../../browser-util/state";

@Component({})
export default class TeamInfo extends Vue {
    @Prop({required: true})
    teamIndex: number;

    @Prop({default: true})
    showFlag: boolean;

    @Prop({default: true})
    showColor: boolean;

    get name(): string {
        return store.state.runDataActiveRun.teams[this.teamIndex].name;
    }

    get playerIndex(): number {
        var idx = 0;
        for (let i = 0; i < this.teamIndex; i++) {
            idx += store.state.runDataActiveRun.teams[i].players.length;
        }
        return idx;
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
  .TeamInfoBox {
    color: var(--font-color);
    padding: 7px;
    font-size: 35px;
    height: 60px;
  }

  .TeamInfoBox > .TeamNameContainer {
      flex-grow: 1;
  }

  .TeamInfoBox > .BingoColor {
    justify-content: center;
    height: 55px;
    width: 55px;
    margin-right: 20px;
    font-size: 40px;
    border-radius: 10%;
    border: 1px white solid;
  }

  /* Bingosync styled gradients */
  .TeamInfoBox > .BingoColor.bingo-green {
    background-image: linear-gradient(#31D814, #00B500 60%, #20A00A);
  }

  .TeamInfoBox > .BingoColor.bingo-red {
    background-image: linear-gradient(#FF4944, #DA4440 60%, #CE302C);
  }

  .TeamInfoBox > .BingoColor.bingo-orange {
    background-image: linear-gradient(#FF9C12, #F98E1E 60%, #D0800F);
  }

  .TeamInfoBox > .BingoColor.bingo-blue {
    background-image: linear-gradient(#409CFF, #37A1DE 60%, #088CBD);
  }

  .TeamInfoBox > .BingoColor.bingo-purple {
    background-image: linear-gradient(#822dbf, #7120ab);
  }

  .TeamInfoBox > .BingoColor.bingo-pink {
    background-image: linear-gradient(#ed86aa, #cc6e8f);
  }

  .TeamInfoBox > .BingoColor.bingo-brown {
    background-image: linear-gradient(#ab5c23, #6d3811);
  }

  .TeamInfoBox > .BingoColor.bingo-teal {
    background-image: linear-gradient(#419695, #2e7372);
  }

  .TeamInfoBox > .BingoColor.bingo-navy {
    background-image: linear-gradient(#0d48b5, #022b75);
  }

  .TeamInfoBox > .BingoColor.bingo-yellow {
    background-image: linear-gradient(#d8d014, #c1ba0b);
  }
</style>