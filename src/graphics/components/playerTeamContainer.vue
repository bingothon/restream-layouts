<template>
    <div class="PlayerTeamContainer FlexContainer">
        <div class="PlayerInfo1">
            <player-info :player="team.players[0]" :playerIndex="playerIndex" :showColor="false" :height="height"></player-info>
        </div>
        <div class="TeamInfo">
            <team-info :teamIndex="teamIndex" :height="height"></team-info>
        </div>
        <div class="PlayerInfo2">
            <player-info :player="team.players[1]" :playerIndex="playerIndex+1" :showColor="false" :height="height"></player-info>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import PlayerInfo from "./playerInfo.vue";
import TeamInfo from "./teamInfo.vue";
import { RunDataTeam } from "../../../speedcontrol-types";
import { store } from "../../browser-util/state";

@Component({
    components:{
        PlayerInfo,
        TeamInfo,
    }
})
export default class PlayerTeamContainer extends Vue {
    @Prop({required: true})
    teamIndex: number;

    @Prop({default: "55px"})
    height: string;

    get team(): RunDataTeam {
        return store.state.runDataActiveRun.teams[this.teamIndex];
    }

    get playerIndex(): number {
        var idx = 0;
        for (let i = 0; i < this.teamIndex; i++) {
            idx += store.state.runDataActiveRun.teams[i].players.length;
        }
        return idx;
    }
}
</script>

<style>
.PlayerTeamContainer {
    flex-direction: column;
    background-image: linear-gradient(#536075, #0b1b1d, rgba(255, 255, 255, 0.2), #23575e);
}

.PlayerTeamContainer > .PlayerInfo1,
.PlayerTeamContainer > .TeamInfo,
.PlayerTeamContainer > .PlayerInfo2 {
    width: 100%;
}

.PlayerTeamContainer > .PlayerInfo1 > div {
    margin-right: 20px;
    border: 2px var(--container-border-color) solid;
}


.PlayerTeamContainer > .PlayerInfo2 > div {
    margin-left: 20px;
    border: 2px var(--container-border-color) solid;
}

</style>