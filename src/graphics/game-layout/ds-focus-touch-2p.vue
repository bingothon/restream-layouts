<template>
    <div id="GameLayout">
        <!--        <div id="stream1top"></div>
		<div id="stream2top"></div>
		<div id="stream1bot"></div>
		<div id="stream2bot"></div>-->
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
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import TimerContainer from '../components/timerContainer.vue';
    import GameContainer from '../components/gameContainer.vue';
    import BingoBoard from '../components/bingoboard.vue';
    import PlayerInfo from '../components/playerInfo.vue';
    import TeamInfo from '../components/teamInfo.vue';
    import PlayerTeamContainer from '../components/playerTeamContainer.vue';
    import DiscordVoiceDisplay from '../components/discordVoiceDisplay.vue';

    @Component({
        components: {
            BingoBoard,
            GameContainer,
            PlayerInfo,
            TeamInfo,
            PlayerTeamContainer,
            TimerContainer,
            DiscordVoiceDisplay
        }
    })
    export default class GameLayout extends Vue {}
</script>

<style scoped>
    #discord-voice {
        position: absolute;
        top: 840px;
        left: 800px;
        width: 320px;
        height: 238px;
        border: 2px var(--container-border-color) solid;
        background-image: url('../../../static/middle-info-background.png');
    }

    .PlayerContainer {
        width: 580px;
    }

    .PlayerContainer >>> .PlayerInfoBox {
        height: 40px;
        font-size: 25px;
    }

    #stream1top {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 800px;
        height: 600px;
        border: 2px var(--container-border-color) solid;
        background-color: red;
    }

    #stream2top {
        position: absolute;
        top: 0px;
        left: 1120px;
        width: 800px;
        height: 600px;
        border: 2px var(--container-border-color) solid;
        background-color: red;
    }

    #stream1bot {
        position: absolute;
        top: 660px;
        left: 0px;
        width: 560px;
        height: 420px;
        border: 2px var(--container-border-color) solid;
        background-color: blue;
    }

    #stream2bot {
        position: absolute;
        top: 660px;
        left: 1360px;
        width: 560px;
        height: 420px;
        border: 2px var(--container-border-color) solid;
        background-color: blue;
    }

    #pi1 {
        position: absolute;
        top: 420px;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 784px;
    }

    #pi2 {
        position: absolute;
        top: 420px;
        left: 1122px;
        border: 2px var(--container-border-color) solid;
        width: 784px;
    }

    #Bingo-board {
        position: absolute;
        top: 0px;
        left: 533px;
        border: 2px var(--container-border-color) solid;
        width: 851px;
        height: 420px;
    }

    #game {
        position: absolute;
        top: 420px;
        left: 800px;
        width: 320px;
        border: 2px var(--container-border-color) solid;
        height: 250px;
        background-image: url('../../../static/middle-info-background.png');
    }

    #timer {
        position: absolute;
        top: 670px;
        left: 800px;
        width: 320px;
        border: 2px var(--container-border-color) solid;
        height: 170px;
        background-image: url('../../../static/middle-info-background.png');
    }
</style>
