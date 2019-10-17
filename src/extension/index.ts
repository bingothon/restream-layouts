import { NodeCG } from 'nodecg/types/server'; // eslint-disable-line
import * as nodecgApiContext from './util/nodecg-api-context';
import { VoiceActivity } from '../../schemas';

export = (nodecg: NodeCG): void => {
  nodecgApiContext.set(nodecg);
  nodecg.log.info('Extension code working!');
  require('./bingosync');
  require('./bingoColors');
  if (nodecg.bundleConfig.discord) {
    if (!nodecg.bundleConfig.discord.test) {
      require('./discord');
    } else {
      const voiceActivity = nodecg.Replicant<VoiceActivity>('voiceActivity', {
        defaultValue: {
          members: [],
        },
        persistent: true,
      });
      const defaultAvatar = 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png';
      voiceActivity.value = {
        members: [
          {
            id: '0', name: 'abc', avatar: defaultAvatar, isSpeaking: false,
          },
          {
            id: '1', name: 'testlongname', avatar: defaultAvatar, isSpeaking: true,
          },
          {
            id: '2', name: 'anotherone', avatar: defaultAvatar, isSpeaking: true,
          },
          {
            id: '3', name: 'POGGERS', avatar: defaultAvatar, isSpeaking: false,
          },
        ],
      };
    }
  }
  require('./twitch-chat-bot');
  require('./gdq-donationtracker');
  require('./streams');
};
