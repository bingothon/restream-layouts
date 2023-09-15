<template>
    <div>
        <twitch-player id="stream1" streamIndex="0"></twitch-player>
        <twitch-player id="stream2" streamIndex="1"></twitch-player>
        <div id="borderline"></div>
        <div id="fillright" class="flexContainer"></div>
        <div id="fillleft" class="flexContainer"></div>
        <div id="fillvoice" class="flexContainer"></div>
        <player-info id="pi1" playerIndex="0" height="45px"></player-info>
        <player-info id="pi2" playerIndex="1" height="45px"></player-info>
        <game-container id="game"></game-container>
        <timer-container id="timer"></timer-container>
        <bingo-board id="Bingo-board" fontSize="30px"></bingo-board>
        <discord-voice-display
            id="discord-voice"
            iconHeight="40px"
            nameWidth="125px"
            maxUserCount="4"
        ></discord-voice-display>
        <tracker id="tracker1" playerNumber="1"></tracker>
        <tracker id="tracker2" playerNumber="2"></tracker>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'
    import { store } from '../../browser-util/state'
    import TimerContainer from '../components/timerContainer.vue'
    import GameContainer from '../components/gameContainer.vue'
    import BingoBoard from '../components/bingoboard.vue'
    import PlayerInfo from '../components/playerInfo.vue'
    import TeamInfo from '../components/teamInfo.vue'
    import PlayerTeamContainer from '../components/playerTeamContainer.vue'
    import DiscordVoiceDisplay from '../components/discordVoiceDisplay.vue'
    import { RunDataTeam } from '../../../speedcontrol-types'
    import Tracker from '../components/tracker.vue'

    @Component({
        components: {
            BingoBoard,
            GameContainer,
            PlayerInfo,
            TeamInfo,
            PlayerTeamContainer,
            TimerContainer,
            DiscordVoiceDisplay,
            Tracker,
        },
    })
    export default class GameLayout extends Vue {
        get teams(): RunDataTeam[] {
            return store.state.runDataActiveRun.teams
        }
    }
</script>

<style scoped>
    #borderline {
        position: absolute;
        top: 0px;
        height: 1080px;
        left: 959px;
        width: 2px;
        background: white;
    }

    #stream1 {
        position: absolute;
        top: 0px;
        left: 160px;
        width: 800px;
        height: 720px;
        border: 2px var(--container-border-color) solid;
        background-color: blue;
    }

    #stream2 {
        position: absolute;
        top: 0px;
        left: 960px;
        width: 800px;
        height: 720px;
        border: 2px var(--container-border-color) solid;
        background-color: red;
    }

    #discord-voice {
        position: absolute;
        top: 780px;
        left: 1280px;
        width: 250px;
        height: 300px;
        background-image: url('../../../static/middle-info-background.png');
        border: 2px var(--container-border-color) solid;
    }

    #fillleft {
        position: absolute;
        width: 160px;
        height: 720px;
        background-image: url('../../../static/middle-info-background.png');
        border: 2px var(--container-border-color) solid;
        left: 0px;
        top: 0px;
    }

    #tracker1 {
        position: absolute;
        left: 10px;
        top: 10px;
    }

    #fillright {
        position: absolute;
        width: 160px;
        height: 720px;
        background-image: url('../../../static/middle-info-background.png');
        border: 2px var(--container-border-color) solid;
        left: 1760px;
        top: 0px;
    }

    #tracker2 {
        position: absolute;
        left: 1770px;
        top: 10px;
    }

    #pi1 {
        position: absolute;
        top: 720px;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 625px;
    }

    #pi2 {
        position: absolute;
        top: 720px;
        left: 1280px;
        border: 2px var(--container-border-color) solid;
        width: 625px;
    }

    #Bingo-board {
        position: absolute;
        top: 720px;
        left: 640px;
        border: 2px var(--container-border-color) solid;
        width: 640px;
        height: 360px;
    }

    #game {
        background-image: url('../../../static/middle-info-background.png');
        position: absolute;
        top: 780px;
        left: 0px;
        width: 640px;
        border: 2px var(--container-border-color) solid;
        height: 300px;
    }

    #timer {
        position: absolute;
        top: 780px;
        left: 1530px;
        background-image: url('../../../static/middle-info-background.png');
        width: 390px;
        border: 2px var(--container-border-color) solid;
        height: 300px;
    }
</style>
