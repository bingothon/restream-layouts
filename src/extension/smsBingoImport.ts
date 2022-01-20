import * as RequestPromise from "request-promise";
import * as nodecgApiContext from "./util/nodecg-api-context";
import {RunData} from "../../speedcontrol-types";

const nodecg = nodecgApiContext.get();
const client = RequestPromise.defaults({});
const log = new nodecg.Logger(`${nodecg.bundleName}:sms.bingo`);

nodecg.listenFor('importSMSBingo', (data): void => {
    let query = '?channel='
    switch (data.channel) {
        case 'Bingothon':
            query += 'bingothon';
            break
        case 'SunshineCommunity':
            query += 'sunshine';
            break;
        case 'SonicSpeedrunCommunity':
            query += 'ssc';
            break;
        case 'SonicAdventureEraSRComm':
            query += 'saesr';
            break;
        default:
            query = '';
            break;
    }
    client.get(`https://${data.website}/api/getSchedule` + query, {json: true})
        .then((data): void => {
            console.log('Got Data from ', data.website, ': ', data)
            data.forEach((run: RunData) => {
                nodecg.sendMessageToBundle('modifyRun', 'nodecg-speedcontrol', {
                    runData: run,
                    updateTwitch: true
                }, (err) => {
                    log.error('error importing run: ', err)
                })
            })
        })
        .catch((err: any): void => {
            log.error('error getting data from ', data.website, ': ', err);
        });
});
