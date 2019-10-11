<template>
  <div
    v-if="prize"
    id="Prize"
    class="FlexContainer"
  >
    <div class="Line1">
      Prize Available: {{ prize.name }}
    </div>
    <div class="Line2">
      Provided by {{ prize.provider }}, minimum donation amount: ${{ prize.minDonation.toFixed(2) }}
      {{ getPrizeTimeUntilString(prize) }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { store } from "../../../../browser-util/state";
import { TrackerPrize } from "../../../../../types";
import clone from 'clone';
import moment from 'moment';
@Component({})
export default class Prize extends Vue {

    @Prop({default: null})
    data: Object;

    prize: TrackerPrize = null;

    created() {
        const fallback = setTimeout(() => this.$emit('end'), 5000);
        const prizes = store.state.trackerPrizes;
        if (!prizes.length) {
            this.$emit('end');
        } else {
            const randNum = Math.floor(Math.random() * prizes.length);
            this.prize = clone(prizes[randNum]);
            clearTimeout(fallback);
            setTimeout(() => this.$emit('end'), 25 * 1000);
        }
    }

    getPrizeTimeUntilString(prize: TrackerPrize) {
        if (prize.endTime) {
            let timeUntil = moment(prize.endTime).fromNow(true);
            timeUntil = timeUntil.replace('an ', ''); // Dirty fix for "Donate in the next an hour".
            timeUntil = timeUntil.replace('a ', ''); // Dirty fix for "Donate in the next a day".
            return `(donate in the next ${timeUntil})`;
        } else {
            return `(donate until the end of the event)`;
        }
    }
}
</script>

<style scoped>
  #Prize {
    padding: 0 17px;
    height: 100%;
    font-weight: 500;
    flex-direction: column;
    align-items: flex-start;
  }
  .Line1 {
    font-size: 26px;
  }
  .Line2 {
    font-size: 20px;
  }
</style>