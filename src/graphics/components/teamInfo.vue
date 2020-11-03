<template>
  <div class="FlexContainer TeamInfoBox"
    :style="{'height' : height}"
  >
    <div
      v-if="bingoColorShown"
      class="BingoColor FlexContainer"
      :class="`bingo-${bingoColor}`"
      :style="{'height' : height, 'width' : height}"
    >
      <span v-if="bingoCountShown">{{bingoGoalCount}}</span>
    </div>
    <div :class="medalClasses"></div>
    <div class="TeamNameContainer">
      <text-fit :text="`${finishTime} ${name || ''}`">
      </text-fit>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { RunDataTeam } from "../../../speedcontrol-types";
import { store } from "../../browser-util/state";
import TextFit from "../helpers/text-fit.vue";

@Component({
  components:{
    TextFit,
  }
})
export default class TeamInfo extends Vue {
    @Prop({required: true})
    teamIndex: number;

    @Prop({default: true})
    showFlag: boolean;

    @Prop({default: true})
    showColor: boolean;

    @Prop({default: "55px"})
    height: string;

    get name(): string {
        const team = store.state.runDataActiveRun.teams[this.teamIndex];
        if (!team) {
          return "";
        }
        return team.name;
    }

    get playerIndex(): number {
        const team = store.state.runDataActiveRun.teams[this.teamIndex];
        if (!team) {
          return -1;
        }
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
        const bingoboard = store.state[store.state.currentMainBingoboard.boardReplicant];
        return <number>bingoboard.colorCounts[store.state.bingoboardMeta.playerColors[this.playerIndex] || "red"];
    }

    get bingoColorShown(): boolean {
        return store.state.bingoboardMeta.colorShown && this.showColor;
    }

    get bingoCountShown(): boolean {
        return store.state.bingoboardMeta.countShown;
    }

    get finishTime(): string {
        // no individual finish time for one team runs
        // also this is disabled for some layouts
        if (store.state.runDataActiveRun.teams.length == 1) {
            return '';
        }
        // get the team this player belongs to
        const teamID = store.state.runDataActiveRun.teams[this.teamIndex].id;
        if (teamID) {
            const finishTime = store.state.timer.teamFinishTimes[teamID];
            if (finishTime) {
                return `[${finishTime.time}] `;
            }
        }
        return '';
    }

  get medalClasses(): string {
    // no individual finish time for one team runs
    // also this is disabled for some layouts
    if (store.state.runDataActiveRun.teams.length == 1) {
      return '';
    }
    // get the team this player belongs to
    const teamID = store.state.runDataActiveRun.teams[this.teamIndex].id;
    if (teamID) {
      const finishTime = store.state.timer.teamFinishTimes[teamID];
      if (finishTime) {
        let place = 1;
        Object.values(store.state.timer.teamFinishTimes).forEach(time => {
          if (time.milliseconds < finishTime.milliseconds) {
            place++;
          }
        });
        let medalColor = null;
        switch(place) {
          case 1: medalColor = 'gold'; break;
          case 2: medalColor = 'silver'; break;
          case 3: medalColor = 'bronze'; break;
        }
        if (medalColor) {
          return `medal shine medal-${medalColor}`;
        }
      }
    }
    return '';
  }
}
</script>

<style>
  @import './medals.css';

  .TeamInfoBox {
    color: var(--font-color);
    padding: 7px;
    font-size: 35px;
    height: 60px;
  }

  .TeamInfoBox > .TeamNameContainer {
    flex-grow: 1;
    flex-shrink: 0;
    height: 100%;
    position: relative;
    white-space: nowrap;
    justify-content: left;
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
