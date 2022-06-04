<template>

    <div>
        <!--<twitch-player id="stream1" streamIndex="0"></twitch-player>
        <twitch-player id="stream2" streamIndex="1"></twitch-player>
        <twitch-player id="stream3" streamIndex="0"></twitch-player>
        <twitch-player id="stream4" streamIndex="1"></twitch-player>-->
        <div id="fillvoiceBOTW" class="flexContainer"></div>
        <player-info id="pi1BOTW" height=45px playerIndex="0" :hide-finish-time="true"></player-info>
        <player-info id="pi2BOTW" height=45px playerIndex="1" :hide-finish-time="true"></player-info>
        <player-info id="pi3" height=45px playerIndex="2" :hide-finish-time="true"></player-info>
        <player-info id="pi4" height=45px playerIndex="3" :hide-finish-time="true"></player-info>
        <timer-container id="timerBOTW"></timer-container>
        <discord-voice-display id="discord-voiceBOTW" iconHeight="40px" maxUserCount="4"
                               nameWidth="125px" voice-highlight-color="darkred"></discord-voice-display>
        <game-container id="gamecNeutral"></game-container>
        <bingo-board id="Bingo-boardBOTW" fontSize="30px"></bingo-board>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {store} from "../../browser-util/state";
import TimerContainer from "../components/timerContainer.vue";
import GameContainer from "../components/gameContainer.vue";
import BingoBoard from "../components/bingoboard.vue";
import PlayerInfo from "../components/playerInfo.vue";
import TeamInfo from "../components/teamInfo.vue";
import PlayerTeamContainer from "../components/playerTeamContainer.vue";
import DiscordVoiceDisplay from "../components/discordVoiceDisplay.vue";
import TwitchPlayer from "../components/twitchPlayer.vue";
import {RunDataTeam} from "../../../speedcontrol-types";

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
    }
})

export default class GameLayout extends Vue {
    get teams(): RunDataTeam[] {
        return store.state.runDataActiveRun.teams;
    }

    get game(): string {
        return store.state.gameMode.game
    }
}
</script>

<style scoped>

#discord-voice {
    position: absolute;
    top: 663px;
    left: 480px;
    width: 360px;
    height: 420px;
    background-image: url("../../../static/background-sunshine.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    border: 2px var(--container-border-color) solid;
}

#pi1 {
    position: absolute;
    top: 0px;
    left: 0px;
    border: 2px var(--container-border-color) solid;
    width: 467px;
}

#pi2 {
    position: absolute;
    top: 1020px;
    left: 0px;
    border: 2px var(--container-border-color) solid;
    width: 467px;
}

#Bingo-board {
    position: absolute;
    top: 0px;
    left: 843px;
    width: 1073px;
    height: 1076px;
    border: 2px var(--container-border-color) solid;
    border-bottom: 2px var(--container-border-color) solid;;
}

#bingo-bottom-border {
    position: absolute;
    left: 845px;
    top: 1078px;
    width: 1080px;
    height: 2px;
    background: white;
}

#game {
    background-image: url("../../../static/background-sunshine.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    top: 0px;
    left: 480px;
    width: 360px;
    border: 2px var(--container-border-color) solid;
    height: 418px;
}

#gamec {
    position: absolute;
    left: 0px;
    width: 360px;
    top: 250px;
}

#logo {
    position: absolute;
    height: 150px;
    top: 75px;
    left: 65px;
}

#timer {
    position: absolute;
    top: 420px;
    left: 0px;
    width: 840px;
    height: 240px;
    background-image: url("../../../static/background-sunshine.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    border: 2px var(--container-border-color) solid;
}

#timer-and-discord-container {
    position: absolute;
    left: 1190px;
    top: 780px;
    width: 730px;
    height: 300px;
    border: 2px var(--container-border-color) solid;
    background-image: url("../../../static/middle-info-background.png");
    background-size: cover;
    background-repeat: no-repeat;
}

#stream1 {
    position: absolute;
    top: 60px;
    left: 0px;
    width: 420px;
    height: 315px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#stream2 {
    position: absolute;
    top: 705px;
    left: 0px;
    width: 420px;
    height: 315px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#stream3 {
    position: absolute;
    top: 60px;
    left: 1360px;
    width: 420px;
    height: 315px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#stream4 {
    position: absolute;
    top: 705px;
    left: 1360px;
    width: 420px;
    height: 315px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#fillvoiceBOTW {
    position: absolute;
    top: 375px;
    left: 0px;
    width: 1920px;
    height: 330px;
    background-image: url("../../../static/background-sunshine.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    border: 2px var(--container-border-color) solid;
}

#discord-voiceBOTW {
    position: absolute;
    top: 575px;
    left: 0px;
    width: 420px;
    height: 130px;
    /*background-image: url("../../../static/middle-info-background.png");*/
    background-size: cover;
    background-repeat: no-repeat;
    /*border: 2px var(--container-border-color) solid;*/
}

#pi1BOTW {
    position: absolute;
    top: 0px;
    left: 0px;
    border: 2px var(--container-border-color) solid;
    width: 403px;
}

#pi2BOTW {
    position: absolute;
    top: 1020px;
    left: 0px;
    border: 2px var(--container-border-color) solid;
    width: 403px;
}

#pi3 {
    position: absolute;
    top: 0px;
    left: 1500px;
    border: 2px var(--container-border-color) solid;
    width: 403px;
}

#pi4 {
    position: absolute;
    top: 1020px;
    left: 1500px;
    border: 2px var(--container-border-color) solid;
    width: 403px;
}

#Bingo-boardBOTW {
    position: absolute;
    top: 0px;
    left: 420px;
    width: 1080px;
    height: 1076px;
    border: 2px var(--container-border-color) solid;
    border-bottom: 2px var(--container-border-color) solid;;
}

#bingo-bottom-borderBOTW {
    position: absolute;
    left: 845px;
    top: 1078px;
    width: 1080px;
    height: 2px;
    background: white;
}

#gamecNeutral {
    /*background-image: url("../../../static/middle-info-background.png");*/
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    left: 0px;
    width: 420px;
    top: 375px;
    /*border: 2px var(--container-border-color) solid;*/
    height: 200px;
}

#timerBOTW {
    position: absolute;
    top: 375px;
    left: 1500px;
    width: 420px;
    height: 330px;
    /*background-image: url("../../../static/middle-info-background.png");*/
    background-size: cover;
    background-repeat: no-repeat;
    /*border: 2px var(--container-border-color) solid;*/
}
</style>
