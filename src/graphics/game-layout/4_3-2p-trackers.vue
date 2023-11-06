<template>
    <div>
        <!-- <twitch-player id="stream1" streamIndex="0"></twitch-player>
        <twitch-player id="stream2" streamIndex="1"></twitch-player> -->
        <div id="borderline"></div>
        <div id="fillvoice" class="flexContainer"></div>
        <player-info id="pi1" height="45px" playerIndex="0" :hide-finish-time="true"></player-info>
        <player-info id="pi2" height="45px" playerIndex="1" :hide-finish-time="true"></player-info>
        <div id="timer-and-discord-container" class="Neutral">
            <timer-container id="timer"></timer-container>
            <!-- <discord-voice-display
                id="discord-voice"
                iconHeight="40px"
                maxUserCount="4"
                nameWidth="125px"
                voice-highlight-color="darkred"
            ></discord-voice-display> -->
        </div>
        <div id="game" class="FlexContainer">
            <game-container id="gamec"></game-container>
        </div>
        <bingo-board id="Bingo-board" fontSize="30px"></bingo-board>
        <tracker id="tracker1" playerNumber="1" alignment="horizontal"></tracker>
        <tracker id="tracker2" playerNumber="2" alignment="horizontal"></tracker>
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
    import TwitchPlayer from '../components/twitchPlayer.vue'
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
            TwitchPlayer,
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
        height: 720px;
        left: 959px;
        width: 2px;
        background: white;
    }

    #discord-voice {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 300px;
        height: 300px;
    }

    #stream1 {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 960px;
        height: 720px;
    }

    #stream2 {
        position: absolute;
        top: 0px;
        left: 960px;
        width: 960px;
        height: 720px;
    }

    #pi1 {
        position: absolute;
        top: 720px;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 715px;
    }

    #pi2 {
        position: absolute;
        top: 720px;
        left: 1190px;
        border: 2px var(--container-border-color) solid;
        width: 715px;
    }

    #tracker1 {
        position: absolute;
        left: 0;
        top: 780px;
        background-image: url('../../../static/middle-info-background.png');
        width: 728px;
        height: 150px;
        border: 2px var(--container-border-color) solid;
    }

    #tracker2 {
        position: absolute;
        left: 1192px;
        top: 780px;
        background-image: url('../../../static/middle-info-background.png');
        width: 728px;
        height: 150px;
        border: 2px var(--container-border-color) solid;
    }

    #Bingo-board {
        position: absolute;
        top: 720px;
        left: 730px;
        border: 2px var(--container-border-color) solid;
        width: 460px;
        height: 360px;
    }

    #game {
        background-image: url('../../../static/middle-info-background.png');
        background-size: cover;
        background-repeat: no-repeat;
        position: absolute;
        top: 920px;
        left: 0px;
        width: 730px;
        border: 2px var(--container-border-color) solid;
        height: 160px;
    }

    #gamec {
        position: absolute;
        left: 0px;
        width: 730px;
    }

    #timer {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 730px;
        height: 160px;
    }

    #timer-and-discord-container {
        position: absolute;
        left: 1190px;
        top: 920px;
        width: 730px;
        height: 160px;
        border: 2px var(--container-border-color) solid;
    }

    .Neutral {
        background-image: url('../../../static/middle-info-background.png');
    }

    #discord-voiceNeutral {
        position: absolute;
        top: 780px;
        left: 1192px;
        width: 320px;
        height: 160px;
        border: 2px var(--container-border-color) solid;
        background-image: url('../../../static/middle-info-background.png');
    }
</style>
