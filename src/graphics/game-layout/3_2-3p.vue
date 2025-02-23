<template>
    <div>
        <div id="stream1"></div>
        <div id="stream2"></div>
        <div id="stream3" s></div>
        <!-- <twitch-player id="stream4" streamIndex="3"></twitch-player>-->
        <div id="fillbar" class="flexContainer"></div>
        <div id="fillvoice" class="flexContainer"></div>
        <div id="fillupperplayers"></div>
        <player-info id="pi1" :playerIndex="playerOffset" height="45px"></player-info>
        <player-info id="pi2" :playerIndex="playerOffset+1" height="45px"></player-info>
        <div id="filllowerplayers"></div>
        <player-info id="pi3" :playerIndex="playerOffset+2" height="45px"></player-info>
        <game-container id="game"></game-container>
        <timer-container id="timer"></timer-container>
        <bingo-board id="Bingo-board" fontSize="30px"></bingo-board>
        <discord-voice-display
            id="discord-voice"
            iconHeight="40px"
            nameWidth="125px"
            maxUserCount="6"
        ></discord-voice-display>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import BingoBoard from '../components/bingoboard.vue';
    import PlayerInfo from '../components/playerInfo.vue';
    import TeamInfo from '../components/teamInfo.vue';
    import PlayerTeamContainer from '../components/playerTeamContainer.vue';
    import DiscordVoiceDisplay from '../components/discordVoiceDisplay.vue';
    import GameContainer from '../components/gameContainer.vue';
    import TimerContainer from '../components/timerContainer.vue';

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
    export default class GameLayout extends Vue {
        get playerOffset(): number {
            const playeroffset = new URLSearchParams(window.location.search).get('playeroffset') ?? '0';
            return parseInt(playeroffset) || 0;
        }
    }
</script>

<style scoped>
    #stream1 {
        position: absolute;
        top: 60px;
        left: 0px;
        width: 720px;
        height: 480px;
    }

    #stream3 {
        position: absolute;
        top: 60px;
        left: 1200px;
        width: 720px;
        height: 480px;
    }

    #stream2 {
        position: absolute;
        top: 500px;
        left: 600px;
        width: 720px;
        height: 480px;
    }

    #discord-voice {
        position: absolute;
        top: 540px;
        left: 1320px;
        width: 600px;
        height: 540px;
        background-image: url("../../../static/middle-info-background.png");
        border: 2px var(--container-border-color) solid;
    }

    #InfoStorageBox1 {
        position: absolute;
        left: 626px;
        top: 0px;
        width: 668px;
        height: 308px;
    }

    .PlayerContainer {
        width: 580px;
    }

    .PlayerContainer >>> .PlayerInfoBox {
        height: 40px;
        font-size: 25px;
    }

    #pi1 {
        position: absolute;
        top: 0px;
        left: 0px;
        border: 2px var(--container-border-color) solid;
        width: 704px;
    }

    #pi3 {
        position: absolute;
        top: 0px;
        left: 1200px;
        border: 2px var(--container-border-color) solid;
        width: 704px;
    }

    #pi2 {
        position: absolute;
        top: 1018px;
        left: 600px;
        border: 2px var(--container-border-color) solid;
        width: 704px;
    }

    #Bingo-board {
        position: absolute;
        top: 0px;
        left: 720px;
        border: 2px var(--container-border-color) solid;
        width: 480px;
        height: 540px;
    }

    #game {
        background-image: url('../../../static/middle-info-background.png');
        position: absolute;
        top: 540px;
        left: 0px;
        width: 600px;
        border: 2px var(--container-border-color) solid;
        height: 270px;
    }

    #timer {
        position: absolute;
        top: 810px;
        left: 0px;
        background-image: url("../../../static/middle-info-background.png");
        width: 600px;
        border: 2px var(--container-border-color) solid;
        height: 270px;
    }
</style>
