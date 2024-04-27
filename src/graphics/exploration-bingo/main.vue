<template>
    <div id="ExplorationBingo">
        <table id="Board">
            <tr :key="i" v-for="(column, i) in bingoCells">
                <td
                    class="square"
                    :class="cell.colors + 'square' + (cell.hidden ? '' : ' shown')"
                    :key="i + '' + j"
                    v-for="(cell, j) in column"
                    @click="squareClicked(cell)"
                >
                    {{ cell.name }}
                </td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { store } from '@/browser-util/state';
    import { ExplorationBingoboard } from '@/schemas';

    interface BingoCell {
        name: string;
        hidden: boolean;
        colors: string;
        row: number;
        column: number;
    }

    function defaultBingoBoard(): BingoCell[][] {
        var result = [];
        for (let i = 0; i < 5; i++) {
            var cur: BingoCell[] = [];
            for (let j = 0; j < 5; j++) {
                cur.push({ name: '', colors: 'blank', row: i, column: j, hidden: true });
            }
            result.push(cur);
        }
        return result;
    }

    @Component({})
    export default class ExplorationBingo extends Vue {
        bingoCells: BingoCell[][] = defaultBingoBoard();

        mounted() {
            console.log(this.bingoCells);
            store.watch((state) => state.explorationBingoboard, this.onBingoBoardUpdate, { immediate: true });
        }

        onBingoBoardUpdate(newGoals: ExplorationBingoboard, oldGoals?: ExplorationBingoboard | undefined) {
            let idx = 0;
            this.bingoCells.forEach((row, rowIndex) => {
                row.forEach((cell, columnIndex) => {
                    // update cell with goal name, if changed
                    const newCell = newGoals.cells[idx];
                    if (!oldGoals || !oldGoals.cells.length || newCell.name != oldGoals.cells[idx].name) {
                        Vue.set(this.bingoCells[rowIndex][columnIndex], 'name', newCell.name);
                    }
                    // update cell with color background, if changed
                    if (!oldGoals || !oldGoals.cells.length || newCell.colors != oldGoals.cells[idx].colors) {
                        Vue.set(this.bingoCells[rowIndex][columnIndex], 'colors', newCell.colors);
                    }
                    Vue.set(this.bingoCells[rowIndex][columnIndex], 'hidden', newCell.hidden);
                    idx++;
                });
            });
        }

        generateCellClasses(color: string, hidden: boolean): string {
            let classes = color + 'square';
            if (!hidden) {
                classes = classes + ' shown';
            }
            return classes;
        }

        squareClicked(cell: BingoCell) {
            if (!cell.hidden) {
                nodecg
                    .sendMessageToBundle('exploration:goalClicked', 'restream-layouts', {
                        index: cell.row * 5 + cell.column
                    })
                    .catch((e) => {
                        console.error(e);
                    });
            }
        }
    }
</script>

<style>
    body {
        /*height: 100%;
		width: 100%;
		background-color: black;*/
    }

    table#Board {
        height: 800px;
        width: 800px;
        border-collapse: collapse;
    }

    /*.square {
        padding: 0;
        height: 20%;
        width: 20%;
        border: 2px black solid;
    }*/

    /* plain old square */
    .square {
        color: #fff;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
        padding: 0 5px;
        cursor: pointer;
        width: 105px;
        height: 95px;
        text-align: center;
        border: 1px #424242 solid;
        background: #181818;

        /* vertical-align changed to top so background colors wont be pushed halfway down */
        vertical-align: center;

        /* position needs to be relative for overflow hidden to work */
        position: relative;
        overflow: hidden;
    }

    .square .bg-color,
    .square .shadow {
        height: inherit;
        position: absolute;
        left: -2px;
        right: -2px;
    }

    .square .bg-color {
        transform-origin: top;
        -webkit-transform-origin: top;
        -moz-transform-origin: top;
    }

    .square:hover .shadow,
    .square.hover .shadow {
        box-shadow: inset 0px 0px 50px rgba(0, 0, 0, 0.6);
        -moz-box-shadow: inset 0px 0px 50px rgba(0, 0, 0, 0.6);
        -webkit-box-shadow: inset 0px 0px 50px rgba(0, 0, 0, 0.6);
    }

    .blanksquare:hover,
    .blanksquare.hover {
        background: #0a245a;
    }

    .square.shown {
        cursor: pointer;
    }

    .greensquare {
        background-image: var(--bingo-color-green);
    }

    .redsquare {
        background-image: var(--bingo-color-red);
    }

    .orangesquare {
        background-image: var(--bingo-color-orange);
    }

    .bluesquare {
        background-image: var(--bingo-color-blue);
    }

    .purplesquare {
        background-image: var(--bingo-color-purple);
    }

    .pinksquare {
        background-image: var(--bingo-color-pink);
    }

    .brownsquare {
        background-image: var(--bingo-color-brown);
    }

    .tealsquare {
        background-image: var(--bingo-color-teal);
    }

    .navysquare {
        background-image: var(--bingo-color-navy);
    }

    .yellowsquare {
        background-image: var(--bingo-color-yellow);
    }
</style>
