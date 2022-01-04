<template>
    <div>
        <twitch-player id="stream1" streamIndex="0"
                       :style="{'border': '2px var(--border-color-' + teamColor1 + ') solid'}"></twitch-player>
        <twitch-player id="stream2" streamIndex="1"
                       :style="{'border': '2px var(--border-color-' + teamColor1 + ') solid'}"></twitch-player>
        <twitch-player id="stream3" streamIndex="2"
                       :style="{'border': '2px var(--border-color-' + teamColor2 + ') solid'}"></twitch-player>
        <twitch-player id="stream4" streamIndex="3"
                       :style="{'border': '2px var(--border-color-' + teamColor2 + ') solid'}"></twitch-player>
        <div id="fillvoice" class="flexContainer"></div>
        <team-info
            team-index="0"
            height="45px"
            id="ti1"
            :style="{
            'border': '5px var(--border-color-' + teamColor1 + ') solid',
            'background-image': 'linear-gradient' + (gameMode === `sa2b` ? '(#230A70FF, #2B0385FF)' : '(#6d001d, #280000)')}"
        ></team-info>
        <player-info
            id="pi1"
            playerIndex="0"
            height=45px
            hide-finish-time="true"
            show-color="false"
            :style="{'border': '5px var(--border-color-' + teamColor1 + ') solid'}"
        ></player-info>
        <player-info
            id="pi2"
            playerIndex="1"
            height=45px
            hide-finish-time="true"
            show-color="false"
            :style="{'border': '5px var(--border-color-' + teamColor1 + ') solid'}"
        ></player-info>
        <team-info
            team-index="1"
            height="45px"
            id="ti2"
            :style="{
            'border': '5px var(--border-color-' + teamColor2 + ') solid',
            'background-image': 'linear-gradient' + (gameMode === `sa2b` ? '(#230A70FF, #2B0385FF)' : '(#6d001d, #280000)')}"
        ></team-info>
        <player-info
            id="pi3"
            playerIndex="2"
            height=45px
            hide-finish-time="true"
            show-color="false"
            :style="{'border': '5px var(--border-color-' + teamColor2 + ') solid'}"
        ></player-info>
        <player-info
            id="pi4"
            playerIndex="3"
            height=45px
            hide-finish-time="true"
            show-color="false"
            :style="{'border': '5px var(--border-color-' + teamColor2 + ') solid'}"
        ></player-info>
        <test-game-container id="game"></test-game-container>
        <test-timer-container id="timer"></test-timer-container>
        <bingo-board id="Bingo-board" fontSize="20px"></bingo-board>
        <discord-voice-display id="discord-voice" iconHeight="40px" nameWidth="114px"
                               maxUserCount="4"></discord-voice-display>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch, Prop} from "vue-property-decorator";
import {store, getReplicant} from "../../browser-util/state";
import TestTimerContainer from "../components/timerContainer.vue";
import TestGameContainer from "../components/gameContainer.vue";
import BingoBoard from "../components/bingoboard.vue";
import PlayerInfo from "../components/playerInfo.vue";
import TeamInfo from "../components/teamInfo.vue";
import PlayerTeamContainer from "../components/playerTeamContainer.vue";
import DiscordVoiceDisplay from "../components/discordVoiceDisplay.vue";
import {BingoboardMeta} from "../../../schemas";

@Component({
    components: {
        BingoBoard,
        TestGameContainer,
        PlayerInfo,
        TeamInfo,
        PlayerTeamContainer,
        TestTimerContainer,
        DiscordVoiceDisplay,
    }
})

export default class GameLayout extends Vue {

    get teamColor1(): string {
        return store.state.bingoboardMeta.playerColors[0];
    }

    get teamColor2(): string {
        return store.state.bingoboardMeta.playerColors[2];
    }

    get gameMode(): string {
        return store.state.gameMode.game
    }
}
</script>

<style scoped>
#stream1 {
    position: absolute;
    top: 69px;
    left: 0px;
    width: 768px;
    height: 433px;
    background-color: aqua;
}

#stream2 {
    position: absolute;
    top: 575px;
    left: 0px;
    width: 768px;
    height: 432px;
    background-color: blue;
}

#stream3 {
    position: absolute;
    top: 69px;
    left: 1153px;
    width: 768px;
    height: 432px;
    background-color: red;
}

#stream4 {
    position: absolute;
    top: 575px;
    left: 1153px;
    width: 768px;
    height: 432px;
    background-color: orange;
}

#discord-voice {
    position: absolute;
    top: 356px;
    left: 772px;
    width: 377px;
    height: 182px;
    background-image: url("../../../static/middle-info-background.png");
    border: 2px var(--container-border-color) solid;
}

#pi1 {
    position: absolute;
    top: 0px;
    left: 0px;
    border: 2px var(--container-border-color) solid;
    width: 747px;
}

#pi2 {
    position: absolute;
    top: 1011px;
    left: 0px;
    border: 2px var(--container-border-color) solid;
    width: 747px;
}

#pi3 {
    position: absolute;
    top: 0px;
    left: 1154px;
    border: 2px var(--container-border-color) solid;
    width: 747px;
}

#pi4 {
    position: absolute;
    top: 1011px;
    left: 1154px;
    border: 2px var(--container-border-color) solid;
    width: 747px;
}

#ti1 {
    position: absolute;
    top: 506px;
    left: 0px;
    width: 747px;
    background-image: linear-gradient(#230A70FF, #2B0385FF);
    border: 2px var(--container-border-color) solid;
}

#ti2 {
    position: absolute;
    top: 506px;
    left: 1154px;
    width: 747px;
    background-image: linear-gradient(var(--lighter-main-color), var(--darker-main-color));
    border: 2px var(--container-border-color) solid;
}

#Bingo-board {
    position: absolute;
    top: 540px;
    left: 772px;
    border: 2px var(--container-border-color) solid;
    width: 377px;
    height: 536px;
}

#game {
    background-image: url("../../../static/middle-info-background.png");
    position: absolute;
    top: 0px;
    left: 771px;
    width: 377px;
    border: 2px var(--container-border-color) solid;
    height: 195px;
}

#timer {
    position: absolute;
    top: 198px;
    left: 771px;
    background-image: url("../../../static/middle-info-background.png");
    width: 377px;
    border: 2px var(--container-border-color) solid;
    height: 155px;
}

</style>
