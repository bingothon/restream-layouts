<template>
  <div>
      <div>{{twitchIcon}}</div>
      <div>{{runnerName}}</div>
      <div>{{runnerFlag}}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { store } from '../../browser-util/state';
import { pathToFileURL } from "url";
import { METHODS } from "http";

@Component({})
export default class TestPlayerContainer extends Vue {
    index = 0;

    get players(): string[] {
      const playerRes = [];
      store.state.runDataActiveRun.teams.forEach(team => {
        team.players.forEach(runner => {
            playerRes.push(runner.name);
        });
      });
      return playerRes;
    }

    changePlayer(init) {
      if (!init) {
        this.index += 1;
        if (this.index >= this.players.length) {
          this.index = 0;
        }
      }
      this.text = this.players[this.index].name;
      if (this.players[this.index].country) {
        this.showFlag = true;
      } else {
        this.showFlag = false;
      }
    }
}



</script>

<style>

</style>