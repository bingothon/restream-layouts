// not sure if a seperate file for this is needed, maybe refactor
import * as nodecgApiContext from './util/nodecg-api-context';
import { BingoboardMeta, AllGameLayouts, AllInterviews, CurrentInterview, CurrentGameLayout } from '../../schemas';
import { BoardColor } from '../../types';
import { RunDataActiveRun } from "../../speedcontrol-types";

const nodecg = nodecgApiContext.get();
const boardMetaRep = nodecg.Replicant<BingoboardMeta>('bingoboardMeta');
const runDataActiveRunRep = nodecg.Replicant<RunDataActiveRun>('runDataActiveRun','nodecg-speedcontrol');

const log = new nodecg.Logger(`${nodecg.bundleName}:bingoColors`);

const ALL_COLORS: BoardColor[] = ['pink', 'red', 'orange', 'brown', 'yellow', 'green', 'teal', 'blue', 'navy', 'purple'];

nodecg.listenFor('timerStart', 'nodecg-speedcontrol', (data) => {
    boardMetaRep.value.boardHidden = false;
});
boardMetaRep.once('change', () => {
    runDataActiveRunRep.on('change', (newValue, old) => {
        // bail on server restart
        if (!newValue || !old) return;
        // Hide board when new run starts
        boardMetaRep.value.boardHidden = true;
        
        // default colors for players
        var newBingoColors: BoardColor[] = [];
        if (newValue.teams) {
            for(var i = 0;i < newValue.teams.length;i++) {
                var team = newValue.teams[i];
                team.players.forEach(player => {
                    newBingoColors.push(ALL_COLORS[i]);
                });
            }
        }
        boardMetaRep.value.playerColors = newBingoColors;
        
        // set other useful defaults
        if (newValue.customData && newValue.customData.Bingotype) {
            var bingotype = newValue.customData.Bingotype;
            if (bingotype.startsWith("single")) {
                boardMetaRep.value.countShown = false;
            } else if (bingotype.startsWith("blackout")) {
                boardMetaRep.value.countShown = true;
            }
        }
    });
});