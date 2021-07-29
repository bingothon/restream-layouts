import * as RequestPromise from "request-promise";
import * as nodecgApiContext from "./util/nodecg-api-context";
import {RunData} from "../../speedcontrol-types";

const nodecg = nodecgApiContext.get();
const client = RequestPromise.defaults({});
const log = new nodecg.Logger(`${nodecg.bundleName}:sms.bingo`);

nodecg.listenFor('importSMSBingo', (data): void => {
    let query = ''
    switch (data.channel) {
        case 'Bingothon':
            query = '?channel=bingothon';
            break
        case 'SunshineCommunity':
            query = '?channel=sunshine';
            break;
        default:
            break;
    }
    client.get('https://sms.bingo/api/getSchedule' + query, {json: true})
        .then((data): void => {
            console.log('Got Data from sms.bingo: ', data)
            console.log("Data Length: ", data.length)
            let i = 0;
            data.forEach((run: RunData) => {
                console.log("Importing Run #", i)
                nodecg.sendMessageToBundle('modifyRun', 'nodecg-speedcontrol', {
                    runData: run,
                    updateTwitch: true
                }, (err) => {
                    log.error('error importing run: ', err)
                })
                console.log("Run #", i, " imported");
            })
        })
        .catch((err: any): void => {
            log.error('error getting data from sms.bingo: ', err);
        });
});
