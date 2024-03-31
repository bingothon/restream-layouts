<template>
    <div>
        Cam Names:
        <select v-model="selectedCamNames">
            <option v-for="(camNames, i) in allCamNamesNames" :key="i" :value="camNames">
                {{ camNames }}
            </option>
        </select>
        <button @click="updateCurrentCamNames">Update Cam Names</button>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'
    import { AllCamNames, CurrentCamNames } from '../../../schemas'
    import { store, getReplicant } from '../../browser-util/state'

    @Component({})
    export default class InterviewControl extends Vue {
        selectedCamNames: string = ''

        mounted() {
            store.watch(
                (state) => state.currentCamNames,
                (newValue) => {
                    this.selectedCamNames = newValue.name
                },
                { immediate: true },
            )
        }

        get allCamNames(): AllCamNames {
            return store.state.allCamNames
        }

        get allCamNamesNames(): string[] {
            return this.allCamNames.map((l) => l.name)
        }

        get currentCamNames(): CurrentCamNames {
            return store.state.currentCamNames
        }

        updateCurrentCamNames() {
            const newCamNames = this.allCamNames.find((l) => l.name === this.selectedCamNames)
            if (!newCamNames) {
                throw new Error("The camNames selected is invalid, that shouldn't happen!")
            }
            getReplicant<CurrentCamNames>('currentCamNames').value = newCamNames
        }
    }
</script>

<style></style>
