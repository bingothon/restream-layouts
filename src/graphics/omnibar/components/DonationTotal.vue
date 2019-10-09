<template>
  <div
    id="Total"
  >
    {{ totalString }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch} from "vue-property-decorator";
import { TweenLite } from "gsap";
import { store } from '../../../browser-util/state';

@Component({})
export default class DonationTotal extends Vue {

  init: boolean = false;
  tweenedTotal: number = -1;

  get donationTotal(): number {
    return store.state.donationTotal;
  }
  
  @Watch('donationTotal')
  onTotalChanged() {
    if (this.init) {
      TweenLite.to(this.$data, 5, { tweenedTotal: this.donationTotal });
    } else {
      this.tweenedTotal = this.donationTotal;
      this.init = true;
    }
  }

  get totalString(): string {
    return `$${this.tweenedTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  
  mounted() {
    this.onTotalChanged();
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
    align-self: center;
    font-variant-numeric: tabular-nums;
  }
</style>