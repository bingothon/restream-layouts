<template>
  <div>
      <div id="name" class="FlexContainer">{{gameName}}</div>
      <div id="extra" class="FlexContainer">{{gameCategory}}|{{gameSystem}}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { store } from '../../browser-util/state';

@Component({})
export default class TestGameContainer extends Vue {
    get gameName(): string {
        return store.state.runDataActiveRun.game;
    }

    get gameCategory(): string {
        return store.state.runDataActiveRun.category;
    }

    get gameSystem(): string {
        return store.state.runDataActiveRun.system;
    }
}
</script>

<style>
#name {
    font-weight: 500;
    font-size: 40px;
    align-content: center;
}

#extra {
    font-size: 35px;
    align-content: center;
}

</style>