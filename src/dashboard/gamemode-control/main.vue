<template>
    <v-app>
        <v-radio-group v-model="gameMode" @change="updateGame">
            <v-radio
                v-for="game in ALL_GAME_MODES"
                :key="game"
                :label="game.name"
                :value="game.id">
            </v-radio>
        </v-radio-group>
    </v-app>
</template>
<script lang="ts">

import {Component, Vue} from "vue-property-decorator"
import {getReplicant, store} from '../../browser-util/state'
import {GameMode} from '../../../schemas'

@Component({})
export default class GameModeControl extends Vue {
    gameMode: "botw" | "sms" | "sa2b" | "neutral" = this.game;

    ALL_GAME_MODES = [{name: "Super Mario Sunshine", id: "sms"},
        {name: "Breath of the Wild", id: "botw"}, {name: "Sonic Adventure 2: Battle", id: "sa2b"},
        {name: "Neutral", id: "neutral"}]

    get game() {
        return store.state.gameMode.game
    }

    updateGame() {
        getReplicant<GameMode>('gameMode').value.game = this.gameMode;
    }
}
</script>

<style>
#selectGame {
    overflow-y: auto;
}
</style>
