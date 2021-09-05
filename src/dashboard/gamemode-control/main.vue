<template>
    <v-app>
        <v-select
            :label="`Current Game: ${game === 'sms' ? 'Super Mario Sunshine': 'Breath of the Wild' }`"
            :items="ALL_GAME_MODES"
            v-model="gameMode"
            @change="updateGame"
        ></v-select>
    </v-app>
</template>
<script lang="ts">

import {Component, Vue} from "vue-property-decorator"
import {getReplicant, store} from '../../browser-util/state'
import {CurrentInterview, GameMode} from '../../../schemas'

@Component({})
export default class GameModeControl extends Vue {
    gameMode : "botw" | "sms" | "neutral" = "sms";

    ALL_GAME_MODES = ["sms", "botw", "neutral"]

    get game() {
        return store.state.gameMode.game
    }

    updateGame(){
            getReplicant<GameMode>('gameMode').value.game = this.gameMode;
    }
}
</script>

<style>
</style>
