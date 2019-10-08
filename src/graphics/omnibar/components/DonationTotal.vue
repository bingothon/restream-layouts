<template>
  <div
    id="Total"
  >
    <span
      v-for="char in totalSplitString"
      :key="char"
      :class="(char === ',' ? 'Comma' : undefined)"
    >
      {{ char }}
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch} from "vue-property-decorator";
import { TweenLite } from "gsap";
const totalRep = nodecg.Replicant('donationTotal');

export default class DonationTotal extends Vue {

  @Prop({default: false})
  init: boolean;

  @Prop({default: -1})
  total: number;

  @Prop({default: 0})
  tweenedTotal: number;
  
  @Prop({default: []})
  totalSplitString;//for some reason it's complaining when i declare Type string, so i don't
  
  @Watch('total')
  OnTotalChanged(val) {
    if (this.init) {
      TweenLite.to(this.$data, 5, { tweenedTotal: val });
    } else {
      this.tweenedTotal = this.total;
      this.init = true;
    }
  }

  @Watch('tweenedTotal')
  OnTweenedTotalChanged(val): void {
    const string = `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    this.totalSplitString = string.split('');
  }
  
  mounted() {
    totalRep.on('change', (newVal: number) => {
      this.total = newVal;
    });
  }
};
</script>

<style scoped>
  #Total {
    padding: 0 10px;
    font-size: 40px;
    font-weight: 500;
    min-width: 50px;
    text-align: center;
  }
  /* Each character in the total is in a span; setting width so the numbers appear monospaced. */
  #Total > span {
    display: inline-block;
    width: 0.45em;
    text-align: center;
  }
  #Total > .Comma {
    display: inline-block;
    width: 0.22em;
    text-align: center;
  }
</style>