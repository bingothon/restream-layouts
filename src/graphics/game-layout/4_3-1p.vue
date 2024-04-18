<template>
    <div>
        <div id="fillbar" class="flexContainer"></div>
        <div id="fillvoice" class="flexContainer"></div>
        <player-info id="pi1" playerIndex="0" height="45px" hideSoundIcon="true"></player-info>
        <game-container id="game"></game-container>
        <timer-container id="timer"></timer-container>
        <bingo-board id="Bingo-board" fontSize="30px"></bingo-board>
        <discord-voice-display
            id="discord-voice"
            iconHeight="40px"
            nameWidth="125px"
            maxUserCount="12"
        ></discord-voice-display>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
    import { nodecg, NodeCG } from '../../browser-util/nodecg';
    import { Bingoboard, BingosyncSocket, BingoboardMeta } from '../../../schemas';
    import { store, getReplicant } from '../../browser-util/state';
    import TimerContainer from '../components/timerContainer.vue';
    import GameContainer from '../components/gameContainer.vue';
    import BingoBoard from '../components/bingoboard.vue';
    import PlayerInfo from '../components/playerInfo.vue';
    import TeamInfo from '../components/teamInfo.vue';
    import PlayerTeamContainer from '../components/playerTeamContainer.vue';
    import DiscordVoiceDisplay from '../components/discordVoiceDisplay.vue';
    import TwitchPlayer from '../components/twitchPlayer.vue';
    import { RunDataPlayer, RunDataTeam } from '../../../speedcontrol-types';

    @Component({
        components: {
            BingoBoard,
            GameContainer,
            PlayerInfo,
            TeamInfo,
            PlayerTeamContainer,
            TimerContainer,
            DiscordVoiceDisplay
        }
    })
    export default class GameLayout extends Vue {
        get teams(): RunDataTeam[] {
            return store.state.runDataActiveRun.teams;
        }
    }
</script>

<style scoped>
    /*#stream1 {
    position: absolute;
    top: 0px;
    left: 587px;
    width: 1333px;
    height: 1000px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
  }*/
    /*#fillbar {
    position: absolute;
    top: 1000px;
    left: 0px;
    width: 1920px;
    height: 80px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
  }*/
    #discord-voice {
        position: absolute;
        top: 460px;
        left: 0px;
        width: 480px;
        height: 200px;
        background-image: url('../../../static/middle-info-background.png');
        border: 2px var(--container-border-color) solid;
    }
    #pi1 {
        position: absolute;
        top: 0px;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 466px;
    }
    #Bingo-board {
        position: absolute;
        top: 660px;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 480px;
        height: 420px;
    }
    #game {
        background-image: url('../../../static/middle-info-background.png');
        position: absolute;
        top: 60px;
        left: 0px;
        width: 480px;
        border: 2px var(--container-border-color) solid;
        height: 180px;
    }
    #timer {
        position: absolute;
        top: 240px;
        left: 0px;
        background-image: url('../../../static/middle-info-background.png');
        width: 480px;
        border: 2px var(--container-border-color) solid;
        height: 220px;
    }
    #player0 {
        position: absolute;
        top: 0px;
        left: 589px;
        width: 1332px;
        height: 1000px;
    }
</style>
