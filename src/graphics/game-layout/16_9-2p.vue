<template>
    <div>
        <div>
            <div id="borderlineBOTW"></div>
            <player-info id="pi1BOTW" height="45px" playerIndex="0" :hide-finish-time="true"></player-info>
            <player-info id="pi2BOTW" height="45px" playerIndex="1" :hide-finish-time="true"></player-info>
            <timer-container id="timerNeutral"></timer-container>
            <discord-voice-display
                id="discord-voiceNeutral"
                iconHeight="40px"
                maxUserCount="8"
                nameWidth="125px"
                voice-highlight-color="darkred"
            ></discord-voice-display>
            <game-container id="gameBOTW"></game-container>
            <!--            <div id="Cam1" class="flexContainer"></div>
                        <div id="Cam2" class="flexContainer"></div>-->
            <bingo-board id="Bingo-boardBOTW" fontSize="30px"></bingo-board>
            <SubNotifs id="SubNotifsNeutral" class="SubNotifs"></SubNotifs>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { store } from '../../browser-util/state';
    import TimerContainer from '../components/timerContainer.vue';
    import GameContainer from '../components/gameContainer.vue';
    import BingoBoard from '../components/bingoboard.vue';
    import PlayerInfo from '../components/playerInfo.vue';
    import TeamInfo from '../components/teamInfo.vue';
    import PlayerTeamContainer from '../components/playerTeamContainer.vue';
    import DiscordVoiceDisplay from '../components/discordVoiceDisplay.vue';
    import TwitchPlayer from '../components/twitchPlayer.vue';
    import { RunDataTeam } from '../../../speedcontrol-types';
    import SubNotifs from '../components/subNotifs.vue';

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
            SubNotifs
        }
    })
    export default class GameLayout extends Vue {
        get teams(): RunDataTeam[] {
            return store.state.runDataActiveRun.teams;
        }

        get game(): string {
            return store.state.gameMode.game;
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

    #borderlineBOTW {
        position: absolute;
        top: 0px;
        height: 540px;
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
        top: 780px;
        left: 0px;
        width: 730px;
        border: 2px var(--container-border-color) solid;
        height: 300px;
    }

    #gamec {
        position: absolute;
        top: 100px;
        left: 0px;
        width: 730px;
    }

    #logo {
        position: absolute;
        height: 150px;
        top: 25px;
        left: 250px;
    }

    #timer {
        position: absolute;
        top: 0px;
        left: 300px;
        width: 440px;
        height: 300px;
    }

    #timer-and-discord-container {
        position: absolute;
        left: 1190px;
        top: 780px;
        width: 730px;
        height: 300px;
        border: 2px var(--container-border-color) solid;
        background-image: url('../../../static/middle-info-background.png');
        background-size: cover;
        background-repeat: no-repeat;
    }

    #stream1 {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 960px;
        height: 540px;
        background-image: url('../../../static/middle-info-background.png');
        border: 2px var(--container-border-color) solid;
    }

    #stream2 {
        position: absolute;
        top: 0px;
        left: 960px;
        width: 960px;
        height: 540px;
        background-image: url('../../../static/middle-info-background.png');
        border: 2px var(--container-border-color) solid;
    }

    #discord-voiceBOTW {
        position: absolute;
        top: 600px;
        left: 1190px;
        width: 300px;
        height: 480px;
        border: 2px var(--container-border-color) solid;
        background-image: url('../../../static/middle-info-background.png');
    }

    #discord-voiceNeutral {
        position: absolute;
        top: 600px;
        left: 1200px;
        width: 288px;
        height: 480px;
        border: 2px var(--container-border-color) solid;
        background-image: url('../../../static/middle-info-background.png');
    }

    #pi1BOTW {
        position: absolute;
        top: 540px;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 943px;
    }

    #pi2BOTW {
        position: absolute;
        top: 540px;
        left: 960px;
        border: 2px var(--container-border-color) solid;
        width: 943px;
    }

    #Bingo-boardBOTW {
        position: absolute;
        top: 600px;
        left: 720px;
        border: 2px var(--container-border-color) solid;
        width: 480px;
        height: 480px;
    }

    #gameBOTW {
        background-image: url('../../../static/middle-info-background.png');
        background-size: cover;
        background-repeat: no-repeat;
        position: absolute;
        top: 600px;
        left: 0px;
        width: 730px;
        border: 2px var(--container-border-color) solid;
        height: 480px;
    }

    #gamecBOTW {
        position: absolute;
        top: 270px;
        left: 0px;
        width: 730px;
    }

    #gamecNeutral {
        position: absolute;
        top: 270px;
        left: 0px;
        width: 730px;
    }

    #logoBOTW {
        position: absolute;
        height: 190px;
        top: 70px;
        left: 245px;
    }

    #timerBOTW {
        position: absolute;
        top: 600px;
        left: 1490px;
        width: 440px;
        height: 480px;
        border: 2px var(--container-border-color) solid;
        background-image: url('../../../static/middle-info-background.png');
    }

    #timerNeutral {
        position: absolute;
        top: 600px;
        left: 1490px;
        width: 430px;
        height: 480px;
        border: 2px var(--container-border-color) solid;
        background-image: url('../../../static/middle-info-background.png');
    }

    #Cam1 {
        position: absolute;
        top: 600px;
        left: 398px;
        width: 320px;
        height: 180px;
        background-color: green;
        border: 2px var(--container-border-color) solid;
    }

    #Cam2 {
        position: absolute;
        top: 600px;
        left: 1192px;
        width: 320px;
        height: 180px;
        background-color: green;
        border: 2px var(--container-border-color) solid;
    }

    .SubNotifs {
        position: absolute;
        top: 888px;
        left: 300px;
        height: 200px;
    }

    /*#timer-and-discord-containerBOTW {
    position: absolute;
    left: 1190px;
    top: 600px;
    width: 730px;
    height: 480px;
    background-image: url("../../../static/middle-info-background.png");
    background-size: cover;
    background-repeat: no-repeat;
}*/
</style>
