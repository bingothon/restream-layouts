<template>
    <div class="Interview">
        <div class="Interview" :class="game === 'sms' ? 'InterviewSMS' : game === 'botw' ? 'InterviewBOTW' : 'InterviewNeutral'"></div>
        <div id="fillvoice" class="flexContainer"></div>
        <div v-if="playerCount.length===4 && teamCount.length===2" id="team-container">
            <player-team-container v-for="teamIndex in teamCount" :key="teamIndex" :teamIndex="teamIndex" class="team"
                                   height="40px"></player-team-container>
        </div>
        <div v-else id="player-container">
            <player-info v-for="playerIndex in playerCount" :key="playerIndex" :playerIndex="playerIndex" class="player"
                         height=45px :hide-finish-time="true"></player-info>
        </div>
        <div v-if="game === 'neutral'">
            <img id="logoNeutral" src="../../../static/bingothon-long-neutral.png">
        </div>
        <div id="game" class="flexContainer">
            <test-game-container id="gamec"></test-game-container>
            <div v-if="game === 'sms'">
                <img id="logo" src="../../../static/Super_Mario_Sunshine_logo.png">
            </div>
            <div v-else-if="game === 'botw'">
                <img id="logoBOTW" src="../../../static/the-legend-of-zelda-breath-of-the-wild-logo.png">
            </div>
        </div>
        <test-timer-container id="timer"></test-timer-container>
        <bingo-board id="Bingo-board" fontSize="20px"></bingo-board>
        <discord-interview id="discord-voice" iconHeight="150px" maxUserCount="9"
                           nameWidth="250px"
                           :voice-highlight-color="game === 'sms' ? 'blue' : 'linear-gradient(var(--lighter-main-color-bingothon), var(--darker-main-color-bingothon))'"></discord-interview>
    </div>
</template>

<script lang="ts">
import {store} from "../../browser-util/state";
import {Component, Vue} from "vue-property-decorator";
import TestTimerContainer from "../components/timerContainer.vue";
import TestGameContainer from "../components/gameContainer.vue";
import BingoBoard from "../components/bingoboard.vue";
import PlayerInfo from "../components/playerInfo.vue";
import TeamInfo from "../components/teamInfo.vue";
import PlayerTeamContainer from "../components/playerTeamContainer.vue";
import DiscordVoiceDisplay from "../components/discordVoiceDisplay.vue";
import DiscordInterview from "../components/discordInterview.vue";

@Component({
    components: {
        DiscordInterview,
        BingoBoard,
        TestGameContainer,
        PlayerInfo,
        TeamInfo,
        PlayerTeamContainer,
        TestTimerContainer,
        DiscordVoiceDisplay,
    }
})

export default class Interview extends Vue {
    get playerCount(): number[] {
        let count = 0;
        const playerIndexes = [];
        store.state.runDataActiveRun.teams.forEach(t => {
            t.players.forEach(p => {
                playerIndexes.push(count);
                count++;
            });
        });
        return playerIndexes;
    }

    get teamCount(): number[] {
        let count = 0;
        const teamIndexes = [];
        store.state.runDataActiveRun.teams.forEach(t => {
            teamIndexes.push(count);
            count++;
        });
        return teamIndexes;
    }

    get game(): string {
        return store.state.gameMode.game;
    }
}
</script>

<style scoped>
#player-container {
    position: absolute;
    top: 500px;
    left: 90px;
}

#team-container {
    position: absolute;
    top: 500px;
    left: 90px;
}

.player {
    width: 500px;
    margin-bottom: 30px;
}

.team {
    width: 500px;
    margin-bottom: 30px;
}

.Interview {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 1920px;
    height: 1080px;
    /*background-image: linear-gradient(var(--darker-main-color-bingothon), var(--lighter-main-color-bingothon))*/
}

.InterviewSMS {
    background-size: cover;
    background-image: url("../../../static/background-sunshine.jpg");
    background-repeat: no-repeat;
}

.InterviewBOTW {
    background-size: cover;
    background-image: url("../../../static/breath-of-the-wild-4k-screenshots-5.jpg");
    background-repeat: no-repeat;
    filter: sepia(100%) saturate(360%) brightness(40%) hue-rotate(298deg) blur(3px);
}

.InterviewNeutral {
    background-size: cover;
    background-repeat: no-repeat;
    background-image: linear-gradient(grey, #554d4d);
    filter: sepia(100%) saturate(360%) brightness(40%) hue-rotate(298deg) blur(3px);
}

#discord-voice {
    position: absolute;
    top: -30px;
    left: 1220px;
    width: 700px;
    height: 1080px;
    /*background-color: var(--container-background-color);*/
}

#logo {
    position: absolute;
    left: 690px;
    top: 10px;
    width: 568px;
    height: 200px;
}

#logoNeutral {
    position: absolute;
    left: 60px;
    top: 60px;
    height: 200px;
}

#Bingo-board {
    position: absolute;
    top: 500px;
    left: 710px;
    width: 500px;
    height: 500px;
}

#game {
    position: absolute;
    top: 50px;
    left: 460px;
    width: 1000px;
    height: 100px;
}

#gamec {
    position: absolute;
    left: 0px;
    width: 1000px;
    top: 200px;
}

#logo {
    position: absolute;
    height: 150px;
    width: 255px;
    top: 25px;
    left: 370px;
}

#logoBOTW {
    position: absolute;
    width: 255px;
    top: -15px;
    left: 370px;
}

#timer {
    position: absolute;
    top: 325px;
    left: 710px;
    width: 500px;
    height: 150px;
}
</style>
