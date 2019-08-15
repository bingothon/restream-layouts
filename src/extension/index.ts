import { NodeCG } from 'nodecg/types/server'; // eslint-disable-line
import * as nodecgApiContext from './util/nodecg-api-context'

export = (nodecg: NodeCG): void => {
  nodecgApiContext.set(nodecg);
  nodecg.log.info('Extension code working!');
  require("./bingosync");
  require("./discord");
  require("./twitch-chat-bot");
  require("./gdq-donationtracker");
  require("./streams");
};
