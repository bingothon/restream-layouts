<template>
  <div id="App">
    {{ text }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Example extends Vue {
  text: string = "test";
}
</script>

<style>
  #App {
    color: green;
  }
</style>
