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

let oldBoard: OriField[] | null = null;
let updateLoopTimer: NodeJS.Timer | null = null;

interface OriField {
  name: string;
  completed: boolean;
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

async function getBoard(boardID: number, playerID: number): Promise<OriField[]> {
  return request.get(`https://orirando.com/bingo/bingothon/${boardID}/player/${playerID}`, { json: true });
}

function init(): void {
  if (boardRep.value.cells.length === 0) {
    for (let i = 0; i < 25; i += 1) {
      boardRep.value.cells.push({ name: '', colors: 'blank', slot: `slot${i}` });
    }
  }
}

async function oriBingoUpdate(): Promise<void> {
  try {
    // eslint-disable-next-line max-len
    const oriBoard: OriField[] = await getBoard(oriBingoMeta.value.boardID, oriBingoMeta.value.playerID);
    oriBoard.forEach((field, idx): void => {
      if (!oldBoard || oldBoard[idx].name !== field.name) {
        boardRep.value.cells[idx].name = processStyling(field.name);
      }
      if (field.completed) {
        boardRep.value.cells[idx].colors = boardMetaRep.value.playerColors[0] || 'red';
      } else {
        boardRep.value.cells[idx].colors = 'blank';
      }
    });
    oldBoard = oriBoard;
    await sleep(3000);
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
