<template>
  <div
    id="RotatingLogos"
  >
    <div
      id="LogoWrapper"
    >
      <transition name="fade">
        <img
          :key="logo"
          :src="logo"
        >
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

const wide = require('../logo-winter-wide.png');
const peLogo = require('../BingothonPureEarth.png');

@Component({})
export default class RotatingLogos extends Vue{
  logo: string = wide;

  mounted(): void {
    this.changeLogo();
  }

  changeLogo() : void {
    this.logo = (this.logo !== wide) ? wide : peLogo;
    const time = (this.logo === peLogo) ? 30 : 30;
    setTimeout(this.changeLogo, time * 1000);
  }
}
</script>

<style scoped>
  #RotatingLogos {
    padding-right: 7px;
  }
  #LogoWrapper {
    position: relative;
    top: 50%;
    width: 230px;
  }
  #LogoWrapper > img {
    position: absolute;
    max-width: 100%;
    transform: translateY(-50%);
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>