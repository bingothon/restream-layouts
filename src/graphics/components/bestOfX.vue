<!-- This component handles displays each player's information within a team. -->
<!-- This is added dynamically to the PlayerContainer component when we need to show this. -->
<!-- It is initialised with most info, it only listens to nodecg-speedcontrol for finish times. -->

<template>
    <div class="MatchCounter FlexContainer">
        <div v-for="i in Math.ceil(totalMatches/2)" class="ScoreCounter FlexContainer" :style="{'height':height}">
            <div v-if="i <= score" class="Score Counter" :style="{'height':height}">
                <img :src="scoreImg" :style="{'height':height}">
            </div>
            <div v-else class="NoScore Counter" :style="{'height':height}">
                <img :src="noScoreImg" :style="{'height':height}">
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import {Prop, Component, Vue} from "vue-property-decorator";
import {store} from "../../browser-util/state";

const noScoreImg = require('../../../static/Shine_Sprite.png');
const scoreImg = require('../../../static/Shine_Sprite.png');

@Component({
    components: {}
})
export default class BestOfX extends Vue {
    @Prop({default: -1})
    playerIndex: number;

    @Prop({default: "55px"})
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
    filter: drop-shadow(0 0 0.75rem)
}

.ScoreCounter > .NoScore > img {
    filter: grayscale(100%);
}


.ScoreCounter {
    width: 100%;
}

.ScoreCounter > .Score > img {
    height: 90px;

}

.MatchCounter > img {
    height: 100%;
    position: absolute;
    filter: invert(1);
}

.MatchCounter.ScoreCounter.NoScore > img {
    filter: grayscale(100%);
}

.MatchCounter {
    height: 50px;
}
</style>
