<template>
  <div>
      <div id="name" class="FlexContainer">{{gameName}}</div>
      <div id="extra" class="FlexContainer">{{gameCategory}} | {{gameSystem}}</div>
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

    get gameEstimate(): string {
        return store.state.runDataActiveRun.estimate;
    }
}
</script>

<style>
#name {
    font-weight: 500;
    font-size: 30px;
    align-content: center;
    align-items: center;
    color: white;
    text-align: center;
    margin: 5px;
}

#extra {
    font-size: 18px;
    font-weight: thin;
    align-content: center;
    color: grey;
    text-align: center;
}

#est {
    font-size: 20px;
    align-content: center;
    color: white;
    text-align: center;
}

</style>