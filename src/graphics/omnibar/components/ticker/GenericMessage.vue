<template>
  <div
    id="GenericMessage"
    :style="cssProps"
  >
    {{ normalisedData.msg }}
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default class GenericMessage extends Vue{
  data: {msg: string, size: number, time: number} = {msg : '', size : 33, time: 25}

  cssProps() {
    return {
      '--font-size': `${this.normalisedData().size}px`,
    };
  }
    
  normalisedData() {
    return Object.assign({
      size: 33,
      time: 25,
    }, this.data);
  }

  mounted() {
    setTimeout(() => this.$emit('end'), this.normalisedData().time * 1000);
  }
};
</script>

<style scoped>
  #GenericMessage {
    height: 100%;
    font-weight: 500;
    font-size: var(--font-size);
    text-align: center;
  }
</style>