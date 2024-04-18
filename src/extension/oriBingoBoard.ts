import * as RequestPromise from 'request-promise';

import * as nodecgApiContext from './util/nodecg-api-context';
import { OriBingoboard, OriBingoMeta, BingoboardMeta } from '../../schemas';

const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger(`${nodecg.bundleName}:oriBingo`);
const request = RequestPromise.defaults({ jar: true });
const boardRep = nodecg.Replicant<OriBingoboard>('oriBingoboard');
const boardMetaRep = nodecg.Replicant<BingoboardMeta>('bingoboardMeta');
// TEST: boardID: 4235, playerID:221
const oriBingoMeta = nodecg.Replicant<OriBingoMeta>('oriBingoMeta');

const emphasisRegex = /\*([^*]+)\*/;

let oldBoard: ExplorationOriField[] | null = null;
let updateLoopTimer: NodeJS.Timer | null = null;

interface OriField {
    name: string;
    completed: boolean;
}

// used to track last state
interface ExplorationOriField {
    name: string;
    completed: boolean;
    revealed: boolean;
}

interface OriApiResponse {
    cards: OriField[], // length 25
    disc_squares: number[],
}

function processStyling(goalName: string): string {
    while (goalName.includes('*')) {
    // eslint-disable-next-line no-param-reassign
        goalName = goalName.replace(emphasisRegex, '<span class="underline">$1</span>');
    }
    return goalName;
}

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve): number => setTimeout(resolve, ms));
}

async function getBoard(boardID: number, playerID: number): Promise<OriApiResponse> {
    return request.get(`https://orirando.com/bingo/bingothon/${boardID}/player/${playerID}`, { json: true });
}

function init(): void {
    if (boardRep.value.cells.length === 0) {
        for (let i = 0; i < 25; i += 1) {
            boardRep.value.cells.push({ name: '', hidden: true, hiddenName: '', colors: 'blank', slot: `slot${i}` });
        }
    }
}

async function oriBingoUpdate(): Promise<void> {
    try {
    // eslint-disable-next-line max-len
        const oriResp = await getBoard(oriBingoMeta.value.boardID, oriBingoMeta.value.playerID);
        const oriResp2 = await getBoard(oriBingoMeta.value.boardID, 1);
        const oriBoard: OriField[] = oriResp.cards;
        const oriBoardRevealed: ExplorationOriField[] = [];
        const playerColor = boardMetaRep.value.playerColors[0] || 'red';
        let goalCount = 0;
        oriBoard.forEach((field, idx): void => {
            const shouldBeRevealed = squareShouldBeRevealed(oriResp, idx);
            if (!oldBoard || oldBoard[idx].name !== field.name || oldBoard[idx].revealed !== shouldBeRevealed) {
                if (shouldBeRevealed) {
                    boardRep.value.cells[idx].name = processStyling(field.name);
                } else {
                    boardRep.value.cells[idx].name = '';
                }
            }
            if (field.completed || oriResp2.cards[idx].completed) {
                boardRep.value.cells[idx].colors = playerColor;
                goalCount++;
            } else {
                boardRep.value.cells[idx].colors = 'blank';
            }
            oriBoardRevealed.push({name: field.name, completed: field.completed, revealed: shouldBeRevealed});
        });
        boardRep.value.colorCounts[playerColor] = goalCount;
        oldBoard = oriBoardRevealed;
    } catch (e) {
        log.error(e);
    }
}

// recover the room at server restart
function recover(): void {
    oriBingoMeta.once('change', async (newVal): Promise<void> => {
        if (!newVal.active) return;
        const { boardID } = newVal;
        const { playerID } = newVal;
        try {
            await getBoard(boardID, playerID);
            updateLoopTimer = setInterval(oriBingoUpdate, 3000);
            log.info('Successfully recovered connection to Ori Board');
        } catch (e) {
            log.error('Can\'t recover connection to Ori Board!', e);
        }
    });
}

function squareShouldBeRevealed(apiResp: OriApiResponse, idx: number): boolean {
    if (apiResp.disc_squares.includes(idx) || apiResp.cards[idx].completed) {
        return true;
    }
    if (idx - 5 >= 0) {
        const other = idx - 5;
        if (apiResp.disc_squares.includes(other) || apiResp.cards[other].completed) {
            return true;
        }
    }
    if (idx % 5 !== 0 && idx - 1 >= 0) {
        const other = idx - 1;
        if (apiResp.disc_squares.includes(other) || apiResp.cards[other].completed) {
            return true;
        }
    }
    if (idx + 5 < 25) {
        const other = idx + 5;
        if (apiResp.disc_squares.includes(other) || apiResp.cards[other].completed) {
            return true;
        }
    }
    if (idx % 5 !== 4 && idx + 1 < 25) {
        const other = idx + 1;
        if (apiResp.disc_squares.includes(other) || apiResp.cards[other].completed) {
            return true;
        }
    }
    return false;
}

nodecg.listenFor('oriBingo:activate', async (data, callback): Promise<void> => {
    try {
        if (updateLoopTimer) {
            clearTimeout(updateLoopTimer);
        }
        // see if the board/player actually exists
        const boardID = parseInt(data.boardID, 10);
        const playerID = parseInt(data.playerID, 10);
        await getBoard(boardID, playerID);
        oriBingoMeta.value = { active: true, boardID, playerID };
        updateLoopTimer = setInterval(oriBingoUpdate, 3000);
        if (callback && !callback.handled) {
            callback();
        }
    } catch (error) {
        log.error(error);
        if (callback && !callback.handled) {
            callback(error);
        }
    }
});

nodecg.listenFor('oriBingo:deactivate', async (_data, callback): Promise<void> => {
    oriBingoMeta.value.active = false;
    if (updateLoopTimer) {
        clearInterval(updateLoopTimer);
    }
    if (callback && !callback.handled) {
        callback();
    }
});

init();
recover();
