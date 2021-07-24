<template>
    <v-app>
        <v-btn
            class="green darken-2"
            @click="importAll"
        >
            <v-icon class="pr-2">
                mdi-plus-box
            </v-icon>
            Import from sms.bingo
        </v-btn>
        <v-btn
            class="red darken-2 mt-3"
            @click="removeAllRuns"
        >
            <v-icon class="pr-2">
                mdi-delete
            </v-icon>
            Remove All Runs
        </v-btn>
    </v-app>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import { nodecg } from '../../browser-util/nodecg';

@Component({})
export default class SMSBingoImport extends Vue {

    async removeAllRuns(confirm: boolean): Promise<void> {
        if (confirm) {
            try {
                await nodecg.sendMessageToBundle('removeAllRuns', "nodecg-speedcontrol");
            } catch (err) {
                // unsuccessful
                console.error('Error while removing Runs: ', err)
            }
        }
    }

    importAll() {
        console.log("Triggered Button Click")
        this.importRuns()
    }

    async importRuns(): Promise<void> {
        console.log("Started Import Function")
        try {
            await nodecg.sendMessage('importSMSBingo')
            console.log('Sent Import Message')
        } catch (err) {
            // unsuccessful
            console.error('Error while importing runs: ', err)
        }
    }
}
</script>

<style scoped>

</style>
