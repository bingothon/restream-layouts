<template>
    <div>
        <div>
            <!--<twitch-player id="stream1" streamIndex="0"></twitch-player>
            <twitch-player id="stream2" streamIndex="1"></twitch-player>-->
            <div id="fillStream1" class="flexContainer"></div>
            <div id="fillStream2" class="flexContainer"></div>
            <div id="fillStream3" class="flexContainer"></div>
            <div id="fillStream4" class="flexContainer"></div>
            <div id="fillStream5" class="flexContainer"></div>
            <div id="fillStream6" class="flexContainer"></div>
            <div id="fillvoiceBOTW" class="flexContainer"></div>
            <test-timer-container id="timerBOTW" :class="{'CoOp':coop}"></test-timer-container>
            <discord-voice-display id="discord-voiceBOTW" iconHeight="40px" maxUserCount="6"
                                   nameWidth="125px" voice-highlight-color="darkred"
                                   :class="{'CoOp':coop}"></discord-voice-display>
            <test-game-container id="gameBOTW" :class="{'CoOp':coop}"></test-game-container>
            <bingo-board id="Bingo-boardBOTW" :class="{'CoOp':coop}" fontSize="30px"></bingo-board>
            <div v-if="coop">
                <div id="ti1">
                    <team-info height="45px" team-index="0"></team-info>
                </div>
                <div id="ti2">
                    <team-info :reverse-order="true" height="45px" team-index="1"></team-info>
                </div>
                <player-info id="pi1BOTW" :hide-finish-time="true" :show-color="!coop" height=30px
                             playerIndex="0"></player-info>
                <player-info id="pi2BOTW" :hide-finish-time="true" :show-color="!coop" height=30px
                             playerIndex="1"></player-info>
                <player-info id="pi3BOTW" :hide-finish-time="true" :show-color="!coop" height=30px
                             playerIndex="2"></player-info>
                <player-info id="pi4BOTW" :hide-finish-time="true" :show-color="!coop" height=30px playerIndex="3"
                             reverse-order></player-info>
                <player-info id="pi5BOTW" :hide-finish-time="true" :show-color="!coop" height=30px playerIndex="4"
                             reverse-order></player-info>
                <player-info id="pi6BOTW" :hide-finish-time="true" :show-color="!coop" height=30px playerIndex="5"
                             reverse-order></player-info>
            </div>
            <div v-else>
                <div id="fillMiddle"></div>
                <player-info id="pi1" :hide-finish-time="true" :show-color="!coop" height=45px
                             playerIndex="0"></player-info>
                <player-info id="pi2" :hide-finish-time="true" :show-color="!coop" height=45px
                             playerIndex="1"></player-info>
                <player-info id="pi3" :hide-finish-time="true" :show-color="!coop" height=45px
                             playerIndex="2"></player-info>
                <player-info id="pi4" :hide-finish-time="true" :show-color="!coop" height=45px playerIndex="3"
                             reverse-order></player-info>
                <player-info id="pi5" :hide-finish-time="true" :show-color="!coop" height=45px playerIndex="4"
                             reverse-order></player-info>
                <player-info id="pi6" :hide-finish-time="true" :show-color="!coop" height=45px playerIndex="5"
                             reverse-order></player-info>
            </div>
        </div>
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
import TwitchPlayer from "../components/twitchPlayer.vue";
import {RunDataTeam} from "../../../speedcontrol-types";

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

    get game(): string {
        return store.state.gameMode.game;
    }

    get coop(): boolean {
        return store.state.runDataActiveRun.teams[0].players.length > 1;
    }
}
</script>

<style scoped>

#fillMiddle {
    top: 0px;
    left: 640px;
    width: 1920px;
    height: 1080px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#fillStream1 {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 640px;
    height: 360px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#fillStream2 {
    position: absolute;
    top: 360px;
    left: 0px;
    width: 640px;
    height: 360px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#fillStream3 {
    position: absolute;
    top: 720px;
    left: 0px;
    width: 640px;
    height: 360px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#fillStream4 {
    position: absolute;
    top: 0px;
    left: 1280px;
    width: 640px;
    height: 360px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#fillStream5 {
    position: absolute;
    top: 360px;
    left: 1280px;
    width: 640px;
    height: 360px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#fillStream6 {
    position: absolute;
    top: 720px;
    left: 1280px;
    width: 640px;
    height: 360px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#ti1 {
    position: absolute;
    top: 0px;
    left: 640px;
    width: 320px;
    height: 60px;
    background-image: linear-gradient(#6d001d, #280000);
    border: 2px var(--container-border-color) solid;
}

#ti2 {
    position: absolute;
    top: 0px;
    left: 960px;
    width: 320px;
    height: 60px;
    background-image: linear-gradient(#6d001d, #280000);
    border: 2px var(--container-border-color) solid;
}

#discord-voiceBOTW {
    position: absolute;
    top: 360px;
    left: 640px;
    width: 640px;
    height: 200px;
    border: 2px var(--container-border-color) solid;
    background-image: url("../../../static/middle-info-background.png");
}

#discord-voiceBOTW.CoOp {
    position: absolute;
    top: 360px;
    left: 640px;
    width: 640px;
    height: 200px;
    border: 2px var(--container-border-color) solid;
    background-image: url("../../../static/middle-info-background.png");
}

#pi1BOTW {
    position: absolute;
    top: 314px;
    left: 640px;
    border: 2px var(--container-border-color) solid;
    width: 306px;
}

#pi2BOTW {
    position: absolute;
    top: 562px;
    left: 640px;
    border: 2px var(--container-border-color) solid;
    width: 306px;
}

#pi3BOTW {
    position: absolute;
    top: 1034px;
    left: 640px;
    border: 2px var(--container-border-color) solid;
    width: 306px;
}

#pi4BOTW {
    position: absolute;
    top: 314px;
    left: 960px;
    border: 2px var(--container-border-color) solid;
    width: 306px;
}

#pi5BOTW {
    position: absolute;
    top: 562px;
    left: 960px;
    border: 2px var(--container-border-color) solid;
    width: 306px;
}

#pi6BOTW {
    position: absolute;
    top: 1034px;
    left: 960px;
    border: 2px var(--container-border-color) solid;
    width: 306px;
}

#pi1 {
    position: absolute;
    top: 240px;
    left: 640px;
    border: 2px var(--container-border-color) solid;
    width: 426px;
}

#pi4 {
    position: absolute;
    top: 300px;
    left: 840px;
    border: 2px var(--container-border-color) solid;
    width: 426px;
}

#pi2 {
    position: absolute;
    top: 560px;
    left: 640px;
    border: 2px var(--container-border-color) solid;
    width: 426px;
}

#pi5 {
    position: absolute;
    top: 620px;
    left: 840px;
    border: 2px var(--container-border-color) solid;
    width: 426px;
}

#pi3 {
    position: absolute;
    top: 960px;
    left: 640px;
    border: 2px var(--container-border-color) solid;
    width: 426px;
}

#pi6 {
    position: absolute;
    top: 1020px;
    left: 840px;
    border: 2px var(--container-border-color) solid;
    width: 426px;
}

#Bingo-boardBOTW {
    position: absolute;
    top: 680px;
    left: 640px;
    border: 2px var(--container-border-color) solid;
    width: 640px;
    height: 280px;
}

#Bingo-boardBOTW.CoOp {
    position: absolute;
    top: 608px;
    left: 640px;
    border: 2px var(--container-border-color) solid;
    width: 640px;
    height: 423px;
}

#gameBOTW.CoOp {
    background-image: url("../../../static/middle-info-background.png");
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    top: 60px;
    left: 640px;
    width: 640px;
    border: 2px var(--container-border-color) solid;
    height: 160px;
}

#gameBOTW {
    background-image: url("../../../static/middle-info-background.png");
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    top: 0px;
    left: 640px;
    width: 640px;
    border: 2px var(--container-border-color) solid;
    height: 160px;
}


#logoBOTW {
    position: absolute;
    height: 190px;
    top: 70px;
    left: 245px;
}

#timerBOTW {
    position: absolute;
    top: 160px;
    left: 640px;
    width: 640px;
    height: 80px;
    border: 2px var(--container-border-color) solid;
    background-image: url("../../../static/middle-info-background.png");
}

#timerBOTW.CoOp {
    position: absolute;
    top: 220px;
    left: 640px;
    width: 640px;
    height: 96px;
    border: 2px var(--container-border-color) solid;
    background-image: url("../../../static/middle-info-background.png");
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
