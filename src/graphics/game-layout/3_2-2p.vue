<template>
    <div id="GameLayout">
        <twitch-player id="stream1" streamIndex="0"></twitch-player>
        <twitch-player id="stream2" streamIndex="1"></twitch-player>
        <div id="fillbar" class="flexContainer"></div>
        <div id="fillvoice" class="flexContainer"></div>
        <player-info id="pi1" height="45px" playerIndex="0" :hide-finish-time="true"></player-info>
        <player-info id="pi2" height="45px" playerIndex="1" :hide-finish-time="true"></player-info>
        <test-game-container id="game"></test-game-container>
        <test-timer-container id="timer"></test-timer-container>
        <bingo-board id="Bingo-board" fontSize="30px"></bingo-board>
        <discord-voice-display
            id="discord-voice"
            iconHeight="40px"
            nameWidth="125px"
            maxUserCount="6"
        ></discord-voice-display>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { store } from '../../browser-util/state';
    import TestTimerContainer from '../components/timerContainer.vue';
    import TestGameContainer from '../components/gameContainer.vue';
    import BingoBoard from '../components/bingoboard.vue';
    import PlayerInfo from '../components/playerInfo.vue';
    import TeamInfo from '../components/teamInfo.vue';
    import PlayerTeamContainer from '../components/playerTeamContainer.vue';
    import DiscordVoiceDisplay from '../components/discordVoiceDisplay.vue';
    import { RunDataTeam } from '../../../speedcontrol-types';

    @Component({
        components: {
            BingoBoard,
            TestGameContainer,
            PlayerInfo,
            TeamInfo,
            PlayerTeamContainer,
            TestTimerContainer,
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
    #GameLayout {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 1920px;
        height: 1080px;
    }

    /*#stream1 {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 960px;
    height: 640px;
    border: 2px var(--container-border-color) solid;
}

#stream2 {
    position: absolute;
    top: 0px;
    left: 960px;
    width: 960px;
    height: 640px;
    border: 2px var(--container-border-color) solid;
}*/

    #discord-voice {
        position: absolute;
        top: 700px;
        left: 1280px;
        width: 250px;
        height: 380px;
        border: 2px var(--container-border-color) solid;
        background-image: url('../../../static/middle-info-background.png');
    }

    #pi1 {
        position: absolute;
        top: 640px;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 626px;
    }

    #pi2 {
        position: absolute;
        top: 640px;
        left: 1280px;
        border: 2px var(--container-border-color) solid;
        width: 626px;
    }

    #Bingo-board {
        position: absolute;
        top: 640px;
        left: 640px;
        border: 2px var(--container-border-color) solid;
        width: 640px;
        height: 440px;
    }

    #game {
        position: absolute;
        top: 700px;
        left: 0px;
        width: 640px;
        border: 2px var(--container-border-color) solid;
        height: 380px;
        background-image: url('../../../static/middle-info-background.png');
    }

    #timer {
        position: absolute;
        top: 700px;
        left: 1530px;
        width: 390px;
        border: 2px var(--container-border-color) solid;
        height: 380px;
        background-image: url('../../../static/middle-info-background.png');
    }

    #player0 {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 960px;
        height: 640px;
    }

    #player1 {
        position: absolute;
        top: 0px;
        left: 961px;
        width: 960px;
        height: 640px;
    }
</style>
