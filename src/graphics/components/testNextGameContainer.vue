<template>
    <div class="NextGameContainer FlexContainer">
        <div class="NextGameName FlexContainer">{{nextGameName}}</div>
        <div class="NextGameExtra FlexContainer">{{nextGameCategory}} | {{nextGameSystem}}</div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { store } from '../../browser-util/state';
import {RunData} from "../../../speedcontrol-types";

@Component({})
export default class TestGameContainer extends Vue {
    get nextGameName(): string {
        return store.state.runDataActiveRun.game;
    }

    get nextGameCategory(): string {
        return this.findNextRun().category;
    }

    get nextGameSystem(): string {
        return this.findNextRun().system;
    }

    findNextRun(): RunData {
        const curRun = store.state.runDataActiveRun;
        return  store.state.runDataArray[this.findRunIndex(curRun) + 1];
	}

    findRunIndex(run : RunData): number {
        let curRunID = run.id;
        if (!curRunID) {
            return -1;
        }
        return store.state.runDataArray.findIndex(run => run.id === curRunID);
    }
}
</script>

<style>
.GameContainer {
    align-content: center;
    align-items: center;
    flex-direction: column;
}

.GameContainer > .GameName {
    font-weight: 500;
    font-size: 30px;
    align-content: center;
    align-items: center;
    color: white;
    text-align: center;
    margin: 5px;
}

.GameContainer > .GameExtra {
    font-size: 18px;
    font-weight: thin;
    align-content: center;
    color: grey;
    text-align: center;
}

/*#est {
    font-size: 20px;
    align-content: center;
    color: white;
    text-align: center;
}*/

</style>
