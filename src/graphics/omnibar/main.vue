<template>
  <div
    id="Omnibar"
  >
    <rotating-logos></rotating-logos>
    <divider></divider>
    <total></total>
    <divider></divider>
    <!--<ticker></ticker>
    <divider></divider>-->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import RotatingLogos from './components/RotatingLogos.vue';
import StaticLogo from './components/StaticLogo.vue';
import Total from './components/DonationTotal.vue';
//import Ticker from './components/Ticker.vue';
import Divider from './components/Divider.vue';

@Component({
  components: {
    StaticLogo,
    RotatingLogos,
    Total,
//    Ticker,
    Divider,
  },
})
export default class Omnibar extends Vue {}
</script>

<style>
  #Omnibar {
    position: fixed;
    display: flex;
    width: 1920px;
    height: 80px;
    justify-content: flex-start;
    background: var(--lighter-main-color);
  }
</style>