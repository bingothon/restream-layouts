<template>
    <v-app>
        <span class="error-warning" @click="errorMessage = ''"> {{ errorMessage }}</span>
        <div class="d-flex justify-center line-buttons">
            <v-btn
                id="override-button"
                class="button"
                dark
                small
                @click="toggleManualScoreOverride"
                :style="`width: 100%`"
            >
                {{ manualScoreOverrideText }}
            </v-btn>
        </div>
        <div v-for="(color, i) in playerColors" :key="i">
            P{{ i }}:
            <v-row v-if="!showPlayBingoOptions">
                <v-col>
                    <v-select :value="color" @input="updatePlayerColor(i, $event)" :items="allColors"></v-select>
                </v-col>
                <v-col v-show="isManualScoreOverride">
                    <v-text-field
                        v-model="manualScore[i]"
                        background-color="#455A64"
                        class="manual-score"
                        dark
                        solo
                        type="number"
                        @change="updateManualScore"
                    />
                </v-col>
            </v-row>
            <v-row v-if="showPlayBingoOptions">
                <v-col>
                    <v-text-field
                        @input="updatePlayerColor(i, $event)"
                        background-color="#455A64"
                        clearable
                        solo
                        dark
                    />
                </v-col>
                <v-col v-show="isManualScoreOverride">
                    <v-text-field
                        v-model="manualScore[i]"
                        background-color="#455A64"
                        class="manual-score"
                        dark
                        solo
                        type="number"
                        @change="updateManualScore"
                    />
                </v-col>
            </v-row>
        </div>
        Select Board:
        <v-select v-model="currentBoardRep" :items="allBingoReps"> </v-select>
        <!-- Normal Bingosync Stuff -->
        <div v-if="showBoardSourceOptions">
            <v-radio-group v-model="boardSource">
                <v-radio value="bingosync" label="Bingosync" />
                <v-radio value="playBingo" label="PlayBingo" />
            </v-radio-group>
        </div>
        <div v-if="showExtraBingosyncOptions">
            <div>
                Room Code or URL:
                <v-text-field v-model="roomCode" background-color="#455A64" clearable solo dark />
            </div>
            <div>
                Passphrase:
                <v-text-field v-model="passphrase" background-color="#455A64" clearable solo dark />
            </div>
            <div class="d-flex justify-center line-buttons">
                <v-btn
                    :disabled="!canDoConnectAction"
                    class="button"
                    dark
                    small
                    @click="connectAction"
                    :style="`width: 100%`"
                >
                    {{ connectActionText }}
                </v-btn>
            </div>
        </div>
        <!-- PlayBingo Stuff -->
        <div v-if="showPlayBingoOptions">
            <div>
                Room:
                <v-text-field v-model="roomCode" background-color="#455A64" clearable solo dark />
            </div>
            <div>
                Passphrase:
                <v-text-field v-model="passphrase" background-color="#455A64" clearable solo dark />
            </div>
            <div class="d-flex justify-center line-buttons">
                <v-btn
                    :disabled="!canConnectPlayBingo"
                    class="button"
                    dark
                    small
                    @click="connectPlayBingo"
                    :style="`width: 100%`"
                >
                    {{ connectActionText }}
                </v-btn>
            </div>
        </div>
        <!-- Exploration Stuff -->
        <div v-if="showExtraExplorationOptions">
            <div>
                Bingosync json:
                <v-text-field v-model="explorationCustomBoard" background-color="#455A64" clearable solo dark />
            </div>
            <v-btn @click="updateExploration" class="button" dark small :style="'width: 100%'">
                Update Exploration
            </v-btn>
            <v-btn @click="resetExploration" class="button" dark small :style="'width: 100%'">
                Reset Exploration
            </v-btn>
        </div>

        <div class="boardOptions">
            <v-btn :disabled="currentBoardActive" @click="switchAction" small class="button" :style="`width: 100%`">
                {{ currentBoardActive ? '[Active] ' : '' }}Switch
            </v-btn>
            <v-btn class="button" dark small @click="toggleCard" :style="`width: 43%`">
                {{ toggleCardText }}
            </v-btn>
            <v-btn class="button" dark small @click="toggleColors" :style="`width: 43%`">
                {{ toggleColorsText }}
            </v-btn>
            <v-btn class="button" dark small @click="toggleCount" :style="`width: 100%`">
                {{ toggleCountText }}
            </v-btn>
        </div>
    </v-app>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { nodecg } from '../../browser-util/nodecg';
    import { BingoboardMeta, CurrentMainBingoboard } from '../../../schemas';
    import { getReplicant, store } from '../../browser-util/state';

    type ColorEnum = 'pink' | 'red' | 'orange' | 'brown' | 'yellow' | 'green' | 'teal' | 'blue' | 'navy' | 'purple';
    type BingoRepEnum = 'bingoboard' | 'oriBingoboard' | 'hostingBingoboard' | 'explorationBingoboard';
    type BoardSource = 'bingosync' | 'playBingo';

    const getSocketRepFromBoard = (board: BingoRepEnum, source?: BoardSource) => {
        if (board === 'bingoboard') {
            switch (source) {
                case 'bingosync':
                    return 'bingosyncSocket';
                case 'playBingo':
                    return 'playBingoSocket';
            }
        } else if (board === 'hostingBingoboard') {
            return 'hostingBingosocket';
        }
    };

    @Component({})
    export default class BingoControl extends Vue {
        roomCode: string = '';

        passphrase: string = '';

        currentBoardRep: BingoRepEnum = 'bingoboard';

        boardSource: BoardSource = 'bingosync';

        oriBoardID: string = '';

        oriPlayerID: string = '';

        explorationCustomBoard: string = '';

        errorMessage: string = '';

        allColors = Object.freeze([
            'pink',
            'red',
            'orange',
            'brown',
            'yellow',
            'green',
            'teal',
            'blue',
            'navy',
            'purple'
        ]);

        allBingoReps: readonly BingoRepEnum[] = Object.freeze(['bingoboard', 'explorationBingoboard']);

        mounted() {
            store.watch(
                (state) => state.currentMainBingoboard,
                (newVal) => {
                    this.currentBoardRep = newVal.boardReplicant;
                },
                { immediate: true }
            );
        }

        // --- computed properties
        get connectActionText(): string {
            const socketRepName = getSocketRepFromBoard(this.currentBoardRep, this.boardSource);
            if (!socketRepName) {
                return 'invalid';
            }
            switch (store.state[socketRepName].status) {
                case 'connected':
                    return 'disconnect';
                case 'disconnected':
                case 'error':
                    return 'connect';
                case 'connecting':
                    return 'connecting...';
                default:
                    return 'invalid';
            }
        }

        get toggleCardText(): string {
            if (store.state.bingoboardMeta.boardHidden) {
                return 'Show Card';
            }
            return 'Hide Card';
        }

        get toggleColorsText(): string {
            if (store.state.bingoboardMeta.colorShown) {
                return 'Hide Colors';
            }
            return 'Show Colors';
        }

        get toggleCountText(): string {
            if (store.state.bingoboardMeta.countShown) {
                return 'Hide Goalcount';
            }
            return 'Show Goalcount';
        }

        get manualScoreOverrideText(): string {
            if (store.state.bingoboardMeta.manualScoreOverride) {
                return 'Disable Manual Score Override';
            }
            return 'Enable Manual Score Override';
        }

        get isManualScoreOverride(): boolean {
            return store.state.bingoboardMeta.manualScoreOverride;
        }

        get toggleOriText(): string {
            if (store.state.oriBingoMeta.active) {
                return 'Deactivate';
            }
            return 'Activate';
        }

        get oriCanActivate(): boolean {
            return store.state.oriBingoMeta.active ? true : !!this.oriBoardID && !!this.oriPlayerID;
        }

        get showPlayBingoOptions(): boolean {
            return this.boardSource === 'playBingo';
        }

        get playerColors(): Array<ColorEnum> {
            return store.state.bingoboardMeta.playerColors;
        }

        get canDoConnectAction(): boolean {
            const socketRepName = getSocketRepFromBoard(this.currentBoardRep, this.boardSource);
            if (!socketRepName) {
                return false;
            }
            switch (store.state[socketRepName].status) {
                case 'connected':
                    return true;
                case 'disconnected':
                case 'error':
                    return !!this.roomCode && !!this.passphrase;
                case 'connecting':
                default:
                    return false;
            }
        }

        get canConnectPlayBingo(): boolean {
            return true;
        }

        get showBoardSourceOptions(): boolean {
            return this.currentBoardRep === 'bingoboard';
        }

        get showExtraBingosyncOptions(): boolean {
            return (
                ['bingoboard', 'hostingBingoboard'].includes(this.currentBoardRep) && this.boardSource === 'bingosync'
            );
        }

        get showExtraOriOptions(): boolean {
            return this.currentBoardRep === 'oriBingoboard';
        }

        get showExtraExplorationOptions(): boolean {
            return this.currentBoardRep === 'explorationBingoboard';
        }

        get currentBoardActive(): boolean {
            return this.currentBoardRep === store.state.currentMainBingoboard.boardReplicant;
        }

        get manualScore(): string[] {
            return store.state.bingoboardMeta.manualScores.map((i) => `${i}`);
        }

        // --- handlers

        updateManualScore() {
            this.manualScore.forEach((score: string, idx: number) => {
                getReplicant<BingoboardMeta>('bingoboardMeta').value.manualScores[idx] = parseInt(score, 10);
            });
        }

        connectAction() {
            // only expanded options for the bingosync connection,
            // otherwise something else is there to handle the board
            if (this.showExtraBingosyncOptions) {
                const socketRepName = getSocketRepFromBoard(this.currentBoardRep, this.boardSource);
                if (!socketRepName) {
                    throw new Error('unreachable');
                }
                switch (store.state[socketRepName].status) {
                    case 'connected':
                        nodecg.sendMessage('bingosync:leaveRoom', { name: this.currentBoardRep }).catch((error) => {
                            nodecg.log.error(error);
                            this.errorMessage = error.message;
                        });
                        break;
                    case 'disconnected':
                    case 'error':
                        getReplicant<CurrentMainBingoboard>('currentMainBingoboard').value.boardReplicant = this
                            .currentBoardRep as BingoRepEnum;
                        nodecg
                            .sendMessage('bingosync:joinRoom', {
                                roomCode: this.roomCode,
                                passphrase: this.passphrase,
                                name: this.currentBoardRep
                            })
                            .catch((error) => {
                                nodecg.log.error(error);
                                this.errorMessage = error.message;
                            });
                        break;
                    default:
                        break;
                }
            }
        }

        connectPlayBingo() {
            if (this.showPlayBingoOptions) {
                const socketRepName = getSocketRepFromBoard(this.currentBoardRep, this.boardSource);
                if (!socketRepName) {
                    throw new Error('unreachable');
                }
                switch (store.state[socketRepName].status) {
                    case 'connected':
                        nodecg.sendMessage('playBingo:disconnect').catch((error) => {
                            nodecg.log.error(error);
                            this.errorMessage = error.message;
                        });
                        break;
                    case 'disconnected':
                    case 'error':
                        this.errorMessage = '';
                        getReplicant<CurrentMainBingoboard>('currentMainBingoboard').value.boardReplicant = this
                            .currentBoardRep as BingoRepEnum;
                        nodecg.sendMessage('bingosync:leaveRoom', { name: this.currentBoardRep }).catch((error) => {
                            nodecg.log.error(error);
                            this.errorMessage = error.message;
                        });
                        nodecg
                            .sendMessage('playBingo:connect', {
                                slug: this.roomCode,
                                passphrase: this.passphrase
                            })
                            .catch((error) => {
                                nodecg.log.error(error);
                                this.errorMessage = error.message;
                            });
                        break;
                    default:
                        break;
                }
            }
        }

        toggleOriActivate() {
            if (store.state.oriBingoMeta.active) {
                nodecg.sendMessage('oriBingo:deactivate');
            } else {
                nodecg
                    .sendMessage('oriBingo:activate', { boardID: this.oriBoardID, playerID: this.oriPlayerID })
                    .catch((error) => {
                        nodecg.log.error(error);
                        this.errorMessage = error.message;
                    });
            }
        }

        updateExploration() {
            try {
                const goals = JSON.parse(this.explorationCustomBoard);
                const onlyNames = goals.map((g) => g.name);
                nodecg.sendMessageToBundle('exploration:newGoals', 'restream-layouts', onlyNames).catch((e) => {
                    this.errorMessage = e.message;
                    nodecg.log.error(e);
                });
            } catch (e) {
                this.errorMessage = "Couldn't parse the board";
            }
        }

        resetExploration() {
            nodecg.sendMessageToBundle('exploration:resetBoard', 'restream-layouts');
        }

        switchAction() {
            getReplicant<CurrentMainBingoboard>('currentMainBingoboard').value.boardReplicant = this
                .currentBoardRep as BingoRepEnum;
        }

        updatePlayerColor(idx: number, val: any) {
            getReplicant<BingoboardMeta>('bingoboardMeta').value.playerColors[idx] = val;
        }

        toggleCard() {
            getReplicant<BingoboardMeta>('bingoboardMeta').value.boardHidden = !store.state.bingoboardMeta.boardHidden;
        }

        toggleColors() {
            getReplicant<BingoboardMeta>('bingoboardMeta').value.colorShown = !store.state.bingoboardMeta.colorShown;
        }

        toggleCount() {
            getReplicant<BingoboardMeta>('bingoboardMeta').value.countShown = !store.state.bingoboardMeta.countShown;
        }

        toggleManualScoreOverride() {
            getReplicant<BingoboardMeta>('bingoboardMeta').value.manualScoreOverride =
                !store.state.bingoboardMeta.manualScoreOverride;
        }
    }
</script>

<style>
    .v-app {
        width: 100%;
    }
    #app {
        width: 100%;
    }
    .error-warning {
        color: red;
        font-size: small;
    }
    input.manual-score {
        width: 3em;
    }
    .override {
        width: 100%;
    }
    .lineButton >>> .v-btn {
        width: 100%;
        margin-bottom: 4px;
        margin-top: 4px;
    }
    .v-btn:not(.v-btn--round).v-size--x-small {
        margin: 2px;
    }
    .halfLine >>> .v-btn {
        width: 49%;
    }
    .v-btn {
        margin: 5px;
    }
</style>
