<!-- This component handles displays each player's information within a team. -->
<!-- This is added dynamically to the PlayerContainer component when we need to show this. -->
<!-- It is initialised with most info, it only listens to nodecg-speedcontrol for finish times. -->

<template>
    <div class="MatchCounter">
        <div v-for="i in Math.ceil(totalMatches/2)">
            <div v-if="i <= score">
                <img :src="scoreImg">
            </div>
            <div v-else>
                <img :src="noScoreImg">
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import {Prop, Component, Vue} from "vue-property-decorator";
import {store} from "../../browser-util/state";

const noScoreImg = require('../_misc/player-solo.png');
const scoreImg = require('../_misc/twitch-icon.png');

@Component({
    components: {}
})
export default class BestOfX extends Vue {
    @Prop({default: -1})
    playerIndex: number;

    get score(): number {
        return store.state.bestOfX.matchCounts[this.playerIndex];
        // return true;
    }

    get totalMatches(): number {
        return store.state.bestOfX.totalMatches;
    }

    get scoreImg(): any {
        return scoreImg;
    }

    get noScoreImg(): any {
        return noScoreImg;
    }
}
</script>

<style>
@import './medals.css';

.PlayerInfoBox {
    background-image: linear-gradient(var(--lighter-main-color), var(--darker-main-color));
    color: var(--font-color);
    padding: 7px;
    font-weight: 500;
    font-size: 30px;
    text-shadow: 3px 3px 5px black;
}

.PlayerInfoBox.ReverseOrder {
    flex-direction: row-reverse;
}

.PlayerInfoBox > .CurrentIcon {
    height: 100%;
    text-align: left;
    position: relative;
}

.MatchCounter > img {
    height: 100%;
    position: absolute;
    filter: invert(1);
}

.PlayerInfoBox > .CurrentIcon > .ScoreContainer {
    font-size: 100%;
    /* color: #f3ad00; */
    /* border: 1px solid #f3ad00; */
    /* background-color: #f3ad00; */
    bottom: 1px;
    color: white;
    height: 75%;
    position: absolute;
    width: 70px;
}

.PlayerInfoBox > .PlayerName {
    flex-grow: 1;
    flex-shrink: 0;
    height: 100%;
    margin-left: 10px;
    margin-right: 10px;
    justify-content: flex-start;
    position: relative;
}

/*.PlayerInfoBox > .PlayerName > div > .FinishTime {
  color: var(--font-colour);
}*/

.PlayerInfoBox > .Flag {
    height: 100%;
    justify-content: flex-end;
    position: relative;
    margin-right: 15px;
}

.PlayerInfoBox.ReverseOrder > .Flag {
    justify-content: flex-start;
}

.PlayerInfoBox > .Flag > img {
    visibility: visible;
    position: absolute;
    border: 1px solid white;
    height: calc(100% - 2px);
}

.PlayerInfoBox > .BingoColor {
    justify-content: center;
    margin-left: 14px;
    font-size: 40px;
    border-radius: 10%;
    border: 1px white solid;
}

.PlayerInfoBox > .Sound > img {
    width: 30px;
}

/* Bingosync styled gradients */
.PlayerInfoBox > .BingoColor.bingo-green {
    background-image: linear-gradient(#129912, #108010 60%, #0c660c);
}

.PlayerInfoBox > .BingoColor.bingo-red {
    background-image: linear-gradient(#FF4944, #DA4440 60%, #CE302C);
}

.PlayerInfoBox > .BingoColor.bingo-orange {
    background-image: linear-gradient(#FF9C12, #F98E1E 60%, #D0800F);
}

.PlayerInfoBox > .BingoColor.bingo-blue {
    background-image: linear-gradient(#409CFF, #37A1DE 60%, #088CBD);
}

.PlayerInfoBox > .BingoColor.bingo-purple {
    background-image: linear-gradient(#822dbf, #7120ab);
}

.PlayerInfoBox > .BingoColor.bingo-pink {
    background-image: linear-gradient(#ed86aa, #cc6e8f);
}

.PlayerInfoBox > .BingoColor.bingo-brown {
    background-image: linear-gradient(#3bd45f, #30b050);
}

.PlayerInfoBox > .BingoColor.bingo-teal {
    background-image: linear-gradient(#419695, #2e7372);
}

.PlayerInfoBox > .BingoColor.bingo-navy {
    background-image: linear-gradient(#1a1aab, #1515be);
}

.PlayerInfoBox > .BingoColor.bingo-yellow {
    background-image: linear-gradient(#80c8c8, #93e0e0);
}
</style>
