<template>
    <div class="PlayerTeamContainer FlexContainer">
        <div class="PlayerInfo1">
            <player-info
                :playerIndex="playerIndex"
                :hideFinishTime="true"
                :showColor="false"
                :height="height"
                :style="{ 'margin-right': margin }"
            ></player-info>
        </div>
        <div class="TeamInfo">
            <team-info :teamIndex="teamIndex" :height="height"></team-info>
        </div>
        <div class="PlayerInfo2">
            <player-info
                :playerIndex="playerIndex + 1"
                :hideFinishTime="true"
                :showColor="false"
                :height="height"
                :reverseOrder="true"
                :style="{ 'margin-left': margin }"
            ></player-info>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';

    import PlayerInfo from './playerInfo.vue';
    import TeamInfo from './teamInfo.vue';
    import { store } from '../../browser-util/state';

    @Component({
        components: {
            PlayerInfo,
            TeamInfo
        }
    })
    export default class PlayerTeamContainer extends Vue {
        @Prop({ default: -1 })
        teamIndex: number;

        @Prop({ default: '55px' })
        height: string;

        @Prop({ default: '20px' })
        margin: string;

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
        background-image: linear-gradient(rgb(43, 3, 133), rgb(35, 10, 112));
    }

    .PlayerTeamContainer > .PlayerInfo1,
    .PlayerTeamContainer > .TeamInfo,
    .PlayerTeamContainer > .PlayerInfo2 {
        width: 100%;
    }

    .PlayerTeamContainer > .PlayerInfo1 > div {
        border: 2px var(--container-border-color) solid;
    }

    .PlayerTeamContainer > .PlayerInfo2 > div {
        border: 2px var(--container-border-color) solid;
    }
</style>
