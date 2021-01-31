<template>
    <v-app>
        <v-switch
            :label="`Current Game: ${game === 'sms' ? 'Super Mario Sunshine': 'Breath of the Wild' }`"
            @change="updateGame"
        ></v-switch>
    </v-app>
</template>
<script lang="ts">

import {Component, Vue} from "vue-property-decorator"
import {getReplicant, store} from '../../browser-util/state'
import {CurrentInterview, GameMode} from '../../../schemas'

@Component({})
export default class GameModeControl extends Vue {
    gameModeSwitch : boolean = this.game === "sms";

    get game() {
        return store.state.gameMode.game
    }

    updateGame(){
        if (this.game === "sms") {
            getReplicant<GameMode>('gameMode').value.game = "botw"
        }  else {
            getReplicant<GameMode>('gameMode').value.game = "sms"
        }
    }
}
</script>

<style>
</style>
