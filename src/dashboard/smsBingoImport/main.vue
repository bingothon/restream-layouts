<template>
    <v-app>
        <span>Import Runs for Channel</span>
        <v-select
            :items="ALL_CHANNELS"
            v-model="channel">
        </v-select>
        <v-btn
            class="green darken-2"
            @click="importAll"
        >
            <v-icon class="pr-2">
                mdi-plus-box
            </v-icon>
            Import from sms.bingo
        </v-btn>
    </v-app>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {nodecg} from '../../browser-util/nodecg';

@Component({})
export default class SMSBingoImport extends Vue {

    ALL_CHANNELS = ["Bingothon", "SunshineCommunity"];
    channel: string = 'Bingothon';

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
            await nodecg.sendMessage('importSMSBingo', {channel: this.channel})
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
