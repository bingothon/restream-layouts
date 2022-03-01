<template>
    <div>
        <div>
            <!--<twitch-player id="stream1" streamIndex="0"></twitch-player>
            <twitch-player id="stream2" streamIndex="1"></twitch-player>-->
            <div id="fillvoice" class="flexContainer"></div>
            <player-info id="pi1" height=45px playerIndex="0" :hide-finish-time="true"></player-info>
            <player-info id="pi2" height=45px playerIndex="1" :hide-finish-time="true"></player-info>
            <timer-container id="timer"></timer-container>
            <discord-voice-display id="discord-voice" iconHeight="40px" maxUserCount="6"
                                   nameWidth="125px" voice-highlight-color="darkred"></discord-voice-display>
            <div id="game" class="flexContainer">
                <game-container id="gamec"></game-container>
                <img id="logo" src="../../../static/Super_Mario_Sunshine_logo.png">
            </div>
            <bingo-board id="Bingo-board" fontSize="30px"></bingo-board>
            <div id="bingo-bottom-border" class="FlexContainer"></div>
        </div>
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
    width: 560px;
    height: 315px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#stream2 {
    position: absolute;
    top: 705px;
    left: 0px;
    width: 560px;
    height: 315px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#discord-voiceBOTW {
    position: absolute;
    top: 707px;
    left: 560px;
    width: 280px;
    height: 372px;
    background-image: url("../../../static/middle-info-background.png");
    background-size: cover;
    background-repeat: no-repeat;
    border: 2px var(--container-border-color) solid;
}

#pi1BOTW {
    position: absolute;
    top: 0px;
    left: 0px;
    border: 2px var(--container-border-color) solid;
    width: 542px;
}

#pi2BOTW {
    position: absolute;
    top: 1020px;
    left: 0px;
    border: 2px var(--container-border-color) solid;
    width: 542px;
}

#Bingo-boardBOTW {
    position: absolute;
    top: 0px;
    left: 843px;
    width: 1073px;
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

#gameBOTW {
    background-image: url("../../../static/middle-info-background.png");
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    top: 0px;
    left: 560px;
    width: 280px;
    border: 2px var(--container-border-color) solid;
    height: 372px;
}

#gameNeutral {
    background-image: url("../../../static/middle-info-background.png");
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    top: 0px;
    left: 560px;
    width: 280px;
    border: 2px var(--container-border-color) solid;
    height: 372px;
}

#gamecBOTW {
    position: absolute;
    left: 0px;
    width: 280px;
    top: 210px;
}

#gamecNeutral {
    position: absolute;
    left: 0px;
    width: 280px;
    top: 100px;
}

#logoBOTW {
    position: absolute;
    height: 150px;
    top: 50px;
    left: 45px;
}

#timerBOTW {
    position: absolute;
    top: 375px;
    left: 0px;
    width: 840px;
    height: 330px;
    background-image: url("../../../static/middle-info-background.png");
    background-size: cover;
    background-repeat: no-repeat;
    border: 2px var(--container-border-color) solid;
}
</style>
