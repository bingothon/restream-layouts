<template>
    <div>
        <div id="fillmiddle" class="flexContainer"></div>
        <div id="stream1" streamIndex="0"></div>
        <div id="stream2" streamIndex="1"></div>
        <div id="stream3" streamIndex="2"></div>
        <div id="stream4" streamIndex="3"></div>
        <div id="fillvoice" class="flexContainer"></div>
        <player-info id="pi1" height=45px playerIndex="0"></player-info>
        <player-info id="pi2" height=45px playerIndex="1"></player-info>
        <player-info id="pi3" height=45px playerIndex="2"></player-info>
        <player-info id="pi4" height=45px playerIndex="3"></player-info>
        <test-game-container id="game"></test-game-container>
        <test-timer-container id="timer"></test-timer-container>
        <bingo-board id="Bingo-board" fontSize="20px"></bingo-board>
        <discord-voice-display id="discord-voice" iconHeight="40px" maxUserCount="6"
                               nameWidth="114px"></discord-voice-display>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {store} from "../../browser-util/state";
import TestTimerContainer from "../components/timerContainer.vue";
import TestGameContainer from "../components/gameContainer.vue";
import BingoBoard from "../components/bingoboard.vue";
import PlayerInfo from "../components/playerInfo.vue";
import TeamInfo from "../components/teamInfo.vue";
import PlayerTeamContainer from "../components/playerTeamContainer.vue";
import DiscordVoiceDisplay from "../components/discordVoiceDisplay.vue";
import {RunDataTeam} from "../../../speedcontrol-types";
import TwitchPlayer from "../components/twitchPlayer.vue";

@Component({
    components: {
        BingoBoard,
        TestGameContainer,
        PlayerInfo,
        TeamInfo,
        PlayerTeamContainer,
        TestTimerContainer,
        DiscordVoiceDisplay,
        TwitchPlayer,
    }
})

export default class GameLayout extends Vue {
    get teams(): RunDataTeam[] {
        return store.state.runDataActiveRun.teams;
    }
}
</script>

<style scoped>
#stream1 {
    position: absolute;
    top: 60px;
    left: 0px;
    width: 782px;
    height: 440px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#stream2 {
    position: absolute;
    top: 60px;
    left: 1138px;
    width: 782px;
    height: 440px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#stream3 {
    position: absolute;
    top: 580px;
    left: 0px;
    width: 782px;
    height: 440px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#stream4 {
    position: absolute;
    top: 580px;
    left: 1138px;
    width: 782px;
    height: 440px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#fillbar {
    position: absolute;
    top: 1000px;
    left: 0px;
    width: 1920px;
    height: 80px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#discord-voice {
    position: absolute;
    top: 500px;
    left: 0px;
    width: 1920px;
    height: 80px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#fillmiddle {
    background-image: url("../../../static/middle-info-background.png");
    position: absolute;
    top: 0px;
    left: 782px;
    width: 356px;
    border: 2px var(--container-border-color) solid;
    height: 1080px;
}

#pi1 {
    position: absolute;
    top: 0px;
    left: 0px;
    border: 2px var(--container-border-color) solid;
    width: 769px;
}

#pi2 {
    position: absolute;
    top: 0px;
    left: 1138px;
    border: 2px var(--container-border-color) solid;
    width: 769px;
}

#pi3 {
    position: absolute;
    top: 1020px;
    left: 0px;
    border: 2px var(--container-border-color) solid;
    width: 769px;
}

#pi4 {
    position: absolute;
    top: 1020px;
    left: 1138px;
    border: 2px var(--container-border-color) solid;
    width: 769px;
}

#Bingo-board {
    position: absolute;
    top: 580px;
    left: 782px;
    border: 2px var(--container-border-color) solid;
    width: 356px;
    height: 500px;
}

#game {
    background-image: url("../../../static/middle-info-background.png");
    position: absolute;
    top: 0px;
    left: 782px;
    width: 356px;
    border: 2px var(--container-border-color) solid;
    height: 300px;
}

#timer {
    position: absolute;
    top: 300px;
    left: 782px;
    background-image: url("../../../static/middle-info-background.png");
    width: 356px;
    border: 2px var(--container-border-color) solid;
    height: 200px;
}
</style>
