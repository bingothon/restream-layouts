<template>
    <div>
        <v-checkbox
            v-model="activated"
            :label="'Enable Best Of ' + totalMatches"
            @change="changeEnabled"
        ></v-checkbox>
        <v-text-field
            v-model="total"
            background-color="#455A64"
            class="score-count"
            dark
            type="number"
            @change="updateTotal"
        />
        <div
            v-for="(count,i) in matchCounts"
            :key="i"
        >
            <v-text-field
                v-model="matches[i]"
                background-color="#455A64"
                class="score-count"
                dark
                type="number"
                @change="updateMatchScores"
            />
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {getReplicant, store} from '../../browser-util/state';
import {BestOfX} from "../../../schemas";


@Component({})
export default class BingoControl extends Vue {

    // --- computed properties
    get enabled(): boolean {
        return store.state.bestOfX.enabled;
    }

    get matchScores(): number[] {
        return store.state.bestOfX.matchCounts;
    }

    get totalMatches(): number {
        return store.state.bestOfX.totalMatches
    }

    get total(): number {
        return this.totalMatches ? this.totalMatches : 3;
    }

    get matchCounts(): string[] {
        return store.state.bestOfX.matchCounts.map(i => `${i}`);
    }

    get activated(): boolean {
        return this.enabled ? this.enabled : false;
    }

    get matches(): string[] {
        return this.matchCounts ? this.matchCounts : ['0', '0', '0', '0'];
    }

    updateMatchScores() {
        this.matchCounts.forEach((score: string, idx: number) => {
            getReplicant<BestOfX>('bestOfX').value.matchCounts[idx] = parseInt(score, 10);
        });
    }

    changeEnabled() {
        getReplicant<BestOfX>('bestOfX').value.enabled = !this.enabled;
    }

    updateTotal() {
        getReplicant<BestOfX>('bestOfX').value.totalMatches = this.totalMatches;
    }
}
</script>

<style>
v-text-field.score-count {
    width: 3em;
}

.button {
    margin: 3px;
}

.line-buttons > .v-btn {
    width: 100%;
}


</style>
