<template>
  <div
    v-if="bid"
    id="Bid"
    class="FlexContainer"
  >
    <div class="Line1">
      <span v-if="bid.goal">
        Upcoming Goal:
      </span>
      <span v-else>
        Upcoming Bid War:
      </span>
      {{ bid.game }}
    </div>
    <div
      ref="Line2"
      class="Line2"
      :style="{
        width: (width > 0) ? `${width}px` : 'inherit'
      }"
    >
      {{ bid.name }} :
      <span v-if="bid.goal">
        {{ formatUSD(bid.amount_raised) }}/{{ formatUSD(bid.goal) }}
      </span>
      <span v-else>
        <span
          v-if="bid.options.length"
          id="Options"
        >
          <span
            v-for="option in bid.options"
            :key="`${option.name}${option.amount_raised}`"
          >
            {{ option.name }} ({{ formatUSD(option.amount_raised) }})
          </span>
          <span v-if="bid.allow_custom_options">
            ...or you could submit your own idea!
          </span>
        </span>
        <span v-else-if="bid.allow_custom_options">
          No options submitted yet, be the first!
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import clone from 'clone';
import { Prop } from 'vue-property-decorator';
import { TweenLite, Linear } from 'gsap';
// eslint-disable-next-line no-unused-vars
import ScrollToPlugin from 'gsap/umd/ScrollToPlugin';

const bids = nodecg.Replicant('trackerOpenBids');
let bid;

export default class Bid extends Vue {

    @Prop({default: null})
    data: Object;

    @Prop({default: undefined})
    bid: Object;

    @Prop({default: null})
    lastBidID: number;

    @Prop({default: 0})
    width: number;

    created() {
        const chosenBid = this.getRandomBid();
        if (!chosenBid) {
        this.$emit('end');
        } else {
        bid = clone(chosenBid);
        }
    }

    mounted() {
      const fallback = setTimeout(() => this.$emit('end'), 5000);
      const originalWidth = this.$parent.$el.clientWidth - 34;
      this.bid = bid;
      Vue.nextTick().then(() => {
        this.width = originalWidth;
        setTimeout(() => {
          clearTimeout(fallback);
          var Line2 = this.$refs.Line2 as Element;
          const amountToScroll = Line2.scrollWidth - originalWidth;
          const timeToScroll = (amountToScroll * 13) / 1000;
          const timeToShow = (timeToScroll > 25) ? timeToScroll : 21;
          TweenLite.to(this.$refs.Line2, timeToShow, {
            scrollTo: { x: 'max' },
            ease: Linear.easeNone,
            onComplete: () => {
              setTimeout(() => this.$emit('end'), 2 * 1000);
            },
          });
        }, 2 * 1000);
      });
    }

    formatUSD(amount) {
      return `$${amount.toFixed(2)}`;
    }

    getRandomBid() {//this whole function is currently broken, need to see how we do this
      const bidChoices = [];
      let totalWeight = 1;
      let randomValue = Math.random();
      const bidToReturn = bidChoices.find((option) => {
        // the actual chance is the relative weight divided by the total weight
        const chance = option.weight / totalWeight;
        if (chance >= randomValue) {
          this.lastBidID = option.bid.id;
          return true;
        }
        randomValue -= chance;
        return false;
      });
      if (bidToReturn) return bidToReturn.bid;
      return null;
    }
}
</script>

<style scoped>
  @import url('../../../_misc/components/FlexContainer.css');
  #Bid {
    padding: 0 17px;
    height: 100%;
    font-weight: 500;
    flex-direction: column;
    align-items: flex-start;
  }
  .Line1 {
    font-size: 25px;
  }
  .Line2 {
    font-size: 23px;
    white-space: nowrap;
    overflow: hidden;
  }
  #Options > span:not(:last-of-type)::after {
    content: '/'
  }
</style>