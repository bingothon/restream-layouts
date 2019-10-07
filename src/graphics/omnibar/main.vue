<template>
  <div
    id="Omnibar"
  >
    <rotating-logos></rotating-logos>
    <divider></divider>
    <total></total>
    <divider></divider>
    <ticker></ticker>
    <divider></divider>
    <clock></clock>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import RotatingLogos from './components/RotatingLogos.vue';
import Total from './components/Total.vue';
import Ticker from './components/Ticker.vue';
import Clock from './components/Clock.vue';
import Divider from './components/Divider.vue';

@Component({
  components: {
    StaticLogo,
    RotatingLogos,
    Total,
    Ticker,
    Clock,
    Divider,
  },
})

export default class Omnibar extends Vue {}
</script>

<style>
  #Omnibar {
    position: fixed;
    width: 1920px;
    height: 80px;
    justify-content: flex-start;
  }
</style>