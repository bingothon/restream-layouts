<!-- This component handles displays each player's information within a team. -->
<!-- This is added dynamically to the PlayerContainer component when we need to show this. -->
<!-- It is initialised with most info, it only listens to nodecg-speedcontrol for finish times. -->

<template>
    <div class="MatchCounter FlexContainer">
        <div v-for="i in Math.ceil(totalMatches / 2)" class="ScoreCounter FlexContainer" :style="{ height: height }">
            <div v-if="i <= score" class="Score Counter" :style="{ height: height }">
                <img v-if="game === 'sms'" :src="scoreImg" class="notGreySMS" :style="{ height: height }" />
                <div v-else class="ScoreIndicator" :style="{ height: height }"></div>
            </div>
            <div v-else class="NoScore Counter" :style="{ height: height }">
                <img v-if="game === 'sms'" class="greySMS" :src="noScoreImg" :style="{ height: height }" />
                <div v-else class="ScoreIndicator grey" :style="{ height: height }"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Prop, Component, Vue } from 'vue-property-decorator';
    import { store } from '../../browser-util/state';

    const noScoreImg = require('../../../static/Shine_Sprite.png');
    const scoreImg = require('../../../static/Shine_Sprite.png');

    @Component({
        components: {}
    })
    export default class BestOfX extends Vue {
        @Prop({ default: -1 })
        playerIndex: number;

        @Prop({ default: '55px' })
        height: string;

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

        get game(): 'sms' | 'sa2b' | 'botw' | 'neutral' {
            return store.state.gameMode.game;
        }
    }
</script>

<style>
    .ScoreCounter > .Counter {
        margin-right: 10px;
        width: auto;
        position: relative;
    }

    .ScoreCounter > .Counter > img {
        height: 100%;
        width: auto;
        position: relative;
    }

    .ScoreCounter {
        width: 100%;
    }

    .ScoreCounter > .Score > img {
        height: 90px;
    }

    .ScoreIndicator {
        width: 20px;
        background-color: gold;
    }

    .MatchCounter > img {
        height: 100%;
        position: absolute;
        filter: invert(1);
    }

    .greySMS {
        filter: grayscale(100%) drop-shadow(0 0 0.75rem);
    }

    .notGreySMS {
        filter: drop-shadow(0 0 0.75rem);
    }

    .grey {
        filter: grayscale(100%);
    }

    .MatchCounter {
        height: 50px;
        margin-right: 10px;
    }
</style>
