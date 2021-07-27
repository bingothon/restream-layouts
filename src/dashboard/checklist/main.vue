<template>
    <v-app>
        <v-btn @click="clearAll">Clear All</v-btn>
        <div v-if="hostsSpeaking">Hosts are currently speaking, don't transition yet</div>
        <div
            class="checkbox-container"
        >
            <div
                v-for="(check, i) in actionsChecked"
                :key="i"
            >
                <v-checkbox v-model="check[1]" :label="check[0]"/>
            </div>
        </div>
    </v-app>
</template>
<script lang="ts">

import {Component, Vue} from "vue-property-decorator"
import {store} from '../../browser-util/state'

const ACTION_LIST_SUNSHINE: string[] = ["Import Runs from sms.bingo in Run Modifications Tab", "Play Next Run in Run Player", "Set Up Bingosync Room (Super Mario Sunshine, Variant: 1 v 1)", "Ask for Player Colors",
    "Check if all RTMP streams are loaded correctly", "Give Commentators and Runners 'Current Match' Role in Discord",
    "Make sure that the streams are cropped correctly", "Unmute the correct stream",  "Final Check", "Go live, unmute Discord and stay hydrated"];

const ACTION_CHECKED_SUNSHINE: [string, boolean][] = [];
ACTION_LIST_SUNSHINE.forEach(a => {
    ACTION_CHECKED_SUNSHINE.push([a, false]);
})

const ACTION_LIST: string[] = ["Set Run Game to current Round", "Set Run Category and Bingomode", "Set Runners", "Play Run", "Set Up Bingosync Room", "Ask for Player Colors",
    "Check if all Twitch streams are loaded correctly and override them if necessary",
    "Make sure that the streams are cropped correctly", "Unmute the correct Twitch stream",  "Final Check", "Go live, unmute Discord and stay hydrated"];

const ACTION_CHECKED: [string, boolean][] = [];
ACTION_LIST.forEach(a => {
    ACTION_CHECKED.push([a, false]);
})

@Component({})
export default class Checklist extends Vue {

    actionsChecked = store.state.gameMode.game === "sms" ? ACTION_CHECKED_SUNSHINE : ACTION_CHECKED;

    get hostsSpeaking() {
        return store.state.hostsSpeakingDuringIntermission.speaking
    }

    clearAll() {
        this.actionsChecked.forEach(action => {
            Vue.set(action, 1, false);
        });
    }
}
</script>

<style>
body {
    /*padding: 1em;*/
}

.checkbox-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.checkbox-container > div {
    width: 50%;
}

.border {
    border: 2px solid black;
    border-radius: 5px;
    padding: 5px;
}

.row {
    display: flex;
}

.column {
    flex: 50%;
}

.multiselect {
    border: solid 1px #768948;
    overflow: auto;
}

.multiselect label {
    display: block;
}

.multiselect-on {
    color: #ffffff;
    background-color: #06BA63;
}

#reward {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #06BA63;
    color: white;
    pointer-events: none;
}

#reward.show {
    opacity: 1 !important;
}

</style>
