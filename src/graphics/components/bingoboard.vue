<template>
  <div id="App">
      <table class="bingo-table">
          <tbody>
            <tr :key="i" v-for="(column,i) in bingoCells">
                <td class="square" :key="i+''+j" v-for="(cell,j) in column">
                    <div :key="color.name" v-for="color in cell.colors" :class="'bg-color '+color.color+'square'" :style="color.style"></div>
                    <div class="shadow"></div>
                    <CellTextFit :text="cell.name" :fontSize="fontSize"/>
                </td>
            </tr>
          </tbody>
      </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { nodecg, NodeCG } from "../../browser-util/nodecg";
import { Bingoboard, BingosyncSocket, BingoboardMeta } from "../../../schemas";
import { store, getReplicant } from "../../browser-util/state";
import CellTextFit from "../helpers/cell-text-fit.vue";

import "./bingosync-style.css";

type ColorEnum = ("pink" | "red" | "orange" | "brown" | "yellow" | "green" | "teal" | "blue" | "navy" | "purple");

interface BingoCell {
    name: string,
    rawColors: string,
    colors: {
        color: string,
        style: string,
    }[],
}

//TODO
const skewAngle = Math.atan(1);
// used from bingosync
const translatePercent = {
    2: ['0', '0'],
    3: ['0', '36', '-34'],
    4: ['0', '46', '0', '-48'],
    5: ['0', '56', '18', '-18', '-56'],
    6: ['0', '60', '30', '0', '-30', '-60'],
    7: ['0', '64', '38', '13', '-13', '-38', '-64'],
    8: ['0', '64', '41', '20', '0', '-21', '-41', '-64'],
    9: ['0', '66', '45', '27', '9', '-9', '-27', '-45', '-66'],
    10: ['0', '68', '51', '34', '17', '0', '-17', '-34', '-51', '-68']
};

const ORDERED_COLORS = ["pink", "red", "orange", "brown", "yellow", "green", "teal", "blue", "navy", "purple"].reverse();

function sortColors(colors: string[]): string[] {
    var orderedColors = [];
    for (var i = 0; i < ORDERED_COLORS.length; i++) {
        if (colors.indexOf(ORDERED_COLORS[i]) !== -1) {
            orderedColors.push(ORDERED_COLORS[i]);
        }
    }
    return orderedColors;
}

const colorToGradient={
    green: "#31D814",
    red: "#FF4944",
    orange: "#FF9C12",
    blue: "#409CFF",
    purple: "#822dbf",
    pink: "#ed86aa",
    brown: "#ab5c23",
    teal: "#419695",
    navy: "#0d48b5",
    yellow: "#d8d014",
};

function defaultBingoBoard(): BingoCell[][] {
    var result = [];
    for (let i = 0; i < 5; i++) {
        var cur: BingoCell[] = [];
        for (let j = 0; j < 5; j++) {
            cur.push({name: "", colors: [], rawColors: "blank"});
        }
        result.push(cur);
    }
    return result;
}

@Component({
    components: {
        CellTextFit
    }
})
export default class BingoBoard extends Vue {
    bingoCells: BingoCell[][] = defaultBingoBoard();
    @Prop({default: "10px"})
    fontSize: string;
    
    mounted() {
        store.watch((state) => state.bingoboard, this.onBingoBoardUpdate);
        // trigger update, otherwise the watcher isn't triggered on reload
        //this.onBingoBoardUpdate(store.state.bingoboard);
    }

    // watch for bingo changes
    onBingoBoardUpdate(newGoals: Bingoboard, oldGoals?: Bingoboard | undefined) {
        let idx = 0;
        this.bingoCells.forEach((row, rowIndex)=>{
            row.forEach((cell,columnIndex)=>{
                // update cell with goal name, if changed
                var newCell = newGoals[idx];
                if (!oldGoals || !oldGoals.length || newCell.name != oldGoals[idx].name) {
                    Vue.set(this.bingoCells[rowIndex][columnIndex],'name', newCell.name);
                }
                // update cell with color backgrounds, if changed
                if (!oldGoals || !oldGoals.length || newCell.colors != oldGoals[idx].colors) {
                    var colors = newCell.colors.split(' ');
                    if (colors[0]!="blank") {
                        colors = sortColors(colors);
                        var newColors = [];
                        newColors.push({color: colors[0], style: ''});
                        var translations = translatePercent[colors.length];
                        for(var i = 1;i<colors.length;i++) {
                            // how bingosync handles the backgrounds, set style here to simply bind it to html later
                            newColors.push({color: colors[i], style:
                                `transform: skew(-${skewAngle}rad) translateX(${translations[i]}%); border-right: solid 1.5px #444444`
                            });
                        }
                        Vue.set(this.bingoCells[rowIndex][columnIndex],'colors', newColors);
                    } else {
                        Vue.set(this.bingoCells[rowIndex][columnIndex],'colors', []);
                    }
                }
                idx++;
            });
        });
    }
}
</script>

<style>
    table {
        width: 100%;
        height: 100%;
        position: absolute;
    }

    @keyframes bingo-splash {
        0% {opacity: 0;font-size: 1px}
        40% {transform: rotate(1800deg); opacity: 1; font-size: 100px;text-shadow: -5px -5px 10px white, 5px -5px 10px white, -5px 5px 10px white, 5px 5px 10px white;}
        70% {transform: rotate(1800deg); opacity: 1; font-size: 100px;text-shadow: -5px -5px 10px white, 5px -5px 10px white, -5px 5px 10px white, 5px 5px 10px white;}
        100% {transform: rotate(1800deg) translateY(30%); opacity: 0; font-size: 90px;text-shadow: -5px -5px 50px white, 5px -5px 50px white, -5px 5px 50px white, 5px 5px 50px white;}
    }

    #bingo-board-hide {
        width: 100%;
        height: 100%;
        background: black;
        position: absolute;
    }

    #bingo-splash {
        position: absolute;
        opacity: 0;
    }

    #bingo-splash.activated {
        animation: bingo-splash 4s;
    }

    .square .bg-color, .square .shadow {
        width: 100%;
        height: 100%;
        /*Remove padding cause the board is kinda small*/
        padding: 0;
        border: 0;
        left: 0;
        right: 0;
    }

    .square {
        padding: 0;
        height: 20%;
        width: 20%;
        border: 2px black solid;
    }

    .text-container {
        left: 0px;
        right: 0px;
    }
    .bingo-table{
        border-collapse: collapse;
    }
    .text-span {
        left: 0px;
        right: 0px;
        top: 50%;
        transform: translateY(-50%);
    }
</style>
