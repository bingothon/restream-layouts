import * as RequestPromise from 'request-promise';

import * as nodecgApiContext from './util/nodecg-api-context';
import { BingoboardMeta, Bingoboard, BingosyncSocket } from '../../schemas';

const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger(`${nodecg.bundleName}:oriBingo`);
const request = RequestPromise.defaults({ jar: true }); // <= Automatically saves and re-uses cookies.
const boardRep = nodecg.Replicant<Bingoboard>('bingoboard');
const boardMetaRep = nodecg.Replicant<BingoboardMeta>('bingoboardMeta');
const oriBingoMeta = nodecg.Replicant('oriBingoMeta', {defaultValue: {active: false, boardID: 4235, playerIDs:[221]}});

const emphasisRegex = /\*([^\*]+)\*/;

interface OriField {
    name: string,
    completed: boolean,
}
boardRep.once('change',() => {
    oriBingoMeta.on('change', (newOriMeta, old) => {
        if (newOriMeta.active) {
            oriBingoUpdateLoop();
        }
    });
});
async function oriBingoUpdateLoop() {
    let oldBoard: OriField[] | null = null;
    while(oriBingoMeta.value.active) {
        try {
            const oriBoard: OriField[] = await request.get(`https://orirando.com/bingo/bingothon/${oriBingoMeta.value.boardID}/player/${oriBingoMeta.value.playerIDs[0]}`, {json: true});
            oriBoard.forEach((field, idx) => {
                if (!oldBoard || oldBoard[idx].name != field.name) {
                    boardRep.value[idx].name = processStyling(field.name);
                }
                if (field.completed) {
                    boardRep.value[idx].colors = "red";
                } else {
                    boardRep.value[idx].colors = "blank";
                }
            });
            oldBoard = oriBoard;
            await sleep(3000);
        } catch(e) {
            log.error(e);
        }
    }
}

function processStyling(goalName: string): string {
    while (goalName.includes('*')) {
        goalName = goalName.replace(emphasisRegex, '<span class="underline">$1</span>');
    }
    return goalName;
}

async function sleep(ms: number) {
    return new Promise((resolve,_ ) => setTimeout(resolve, ms));
}