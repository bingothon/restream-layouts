<template>
  <div
    id="Alert"
    class="FlexContainer"
  >
    <div class="Line1">
      {{ line1 }}
    </div>
    <div
      v-if="line2"
      ref="Line2"
      class="Line2"
      :style="{
        width: (width > 0) ? `${width}px` : 'inherit'
      }"
    >
      {{ line2 }}
    </div>
  </div>
</template>

<script lang="ts">
import { TweenLite, Linear } from 'gsap';
// eslint-disable-next-line no-unused-vars
import ScrollToPlugin from 'gsap/umd/ScrollToPlugin';
import { Prop, Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Alert extends Vue {

    @Prop({})
    data: {line1Text: string, line2Text: string} = {line1Text : '', line2Text : ''}

    @Prop({default: 0})
    width: number;

    @Prop({default: ''})
    line1: string;

    @Prop({default: ''})
    line2: string;

    @Prop({default: false})
    tweet: boolean;
    
    mounted() {
    const fallback = setTimeout(() => this.$emit('end'), 5000);
    const originalWidth = this.$parent.$el.clientWidth - 34;
    this.line1 = this.data.line1Text;
    if (!this.data.line2Text) {
        setTimeout(() => this.$emit('end'), 10 * 1000);
    } else {
        this.line2 = this.data.line2Text;
        Vue.nextTick().then(() => {
        this.width = originalWidth;
        setTimeout(() => {
            clearTimeout(fallback);
            var Line2 = this.$refs.Line2 as Element;
            const amountToScroll = Line2.scrollWidth - originalWidth;
            const timeToScroll = (amountToScroll * 13) / 1000;
            const timeToShow = (timeToScroll > 10) ? timeToScroll : 6;
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
  }
}
</script>

<style scoped>
  #Alert {
    padding: 0 17px;
    height: 100%;
    font-weight: 500;
    flex-direction: column;
    align-items: flex-start;
    background-color: #ffffff38;
  }
  .Line1 {
    font-size: 25px;
  }
  .Line2 {
    font-size: 23px;
    white-space: nowrap;
    overflow: hidden;
  }
  .Line1 > .TwitterLogo, .Line1 > .CrowdControlLogo {
    height: 1.2em;
    margin: 0 .05em 0 .1em;
    vertical-align: -0.25em;
  }
</style>