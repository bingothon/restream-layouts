<template>
	<div id="ExplorationBingo">
        <table id="Board">
           <tr :key="i" v-for="(column,i) in bingoCells">
                <td
                    class="square"
                    :class="cell.colors+'square'+(cell.hidden?'':' shown')"
                    :key="i+''+j"
                    v-for="(cell,j) in column"
                    @click="squareClicked(cell)"
                >
                    {{cell.name}}
                </td>
           </tr>
        </table>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from "vue-property-decorator";
    import {store} from "../../browser-util/state";
    import {TrackerPrize} from "../../../types";
    import moment from 'moment';
    import {TrackerOpenBids, ExplorationBingoboard} from "../../../schemas";

    interface BingoCell {
        name: string,
        hidden: boolean,
        colors: string,
        row: number,
        column: number,
    }


    function defaultBingoBoard(): BingoCell[][] {
        var result = [];
        for (let i = 0; i < 5; i++) {
            var cur: BingoCell[] = [];
            for (let j = 0; j < 5; j++) {
                cur.push({name: "", colors: "blank", row: i, column: j, hidden: true});
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
            store.watch(state => state.explorationBingoboard, this.onBingoBoardUpdate, {immediate: true});
        }

        onBingoBoardUpdate(newGoals: ExplorationBingoboard, oldGoals?: ExplorationBingoboard | undefined) {
            let idx = 0;
            this.bingoCells.forEach((row, rowIndex)=>{
                row.forEach((cell,columnIndex)=>{
                    // update cell with goal name, if changed
                    const newCell = newGoals.cells[idx];
                    if (!oldGoals || !oldGoals.cells.length || newCell.name != oldGoals.cells[idx].name) {
                        Vue.set(this.bingoCells[rowIndex][columnIndex],'name', newCell.name);
                    }
                    // update cell with color background, if changed
                    if (!oldGoals || !oldGoals.cells.length || newCell.colors != oldGoals.cells[idx].colors) {
                        Vue.set(this.bingoCells[rowIndex][columnIndex],'colors', newCell.colors);
                    }
                    Vue.set(this.bingoCells[rowIndex][columnIndex],'hidden', newCell.hidden);
                    idx++;
                });
            });
        }

        generateCellClasses(color: string, hidden: boolean): string {
            let classes = color+'square';
            if (!hidden) {
                classes = classes + ' shown';
            }
            return classes;
        }

        squareClicked(cell: BingoCell) {
            if (!cell.hidden) {
                nodecg.sendMessageToBundle('exploration:goalClicked','bingothon-layouts',{index: cell.row * 5 + cell.column})
                    .catch(e => {
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

    .square {
        padding: 0;
        height: 20%;
        width: 20%;
        border: 2px black solid;
    }

    .square.shown {
        cursor: pointer;
    }

    .greensquare {
        background-image: linear-gradient(#31D814, #00B500 60%, #20A00A);
    }

    .redsquare {
        background-image: linear-gradient(#FF4944, #DA4440 60%, #CE302C);
    }

    .orangesquare {
        background-image: linear-gradient(#FF9C12, #F98E1E 60%, #D0800F);
    }

    .bluesquare {
        background-image: linear-gradient(#409CFF, #37A1DE 60%, #088CBD);
    }

    .purplesquare {
        background-image: linear-gradient(#822dbf, #7120ab);
    }

    .pinksquare {
        background-image: linear-gradient(#ed86aa, #cc6e8f);
    }

    .brownsquare {
        background-image: linear-gradient(#ab5c23, #6d3811);
    }

    .tealsquare {
        background-image: linear-gradient(#419695, #2e7372);
    }

    .navysquare {
        background-image: linear-gradient(#0d48b5, #022b75);
    }

    .yellowsquare {
        background-image: linear-gradient(#d8d014, #c1ba0b);
    }
</style>
