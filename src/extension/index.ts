import {NodeCG} from 'nodecg/types/server'; // eslint-disable-line
import * as nodecgApiContext from './util/nodecg-api-context';
import {ShowPictureDuringIntermission, SongData, VoiceActivity, VoiceActivitySunshine} from '../../schemas';

/* eslint-disable global-require */

export = (nodecg: NodeCG): void => {
    nodecgApiContext.set(nodecg);
    nodecg.log.info('Extension code working!');
    const {bundleConfig} = nodecg;
    require('./bingosync');
    require('./bingoColors');
    require('./countdownTimer');
    require('./oriBingoBoard');
    require('./explorationBingo');

    const defaultAvatar = 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png';
    const discordTestMembers = [
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
        {
            id: '4', name: 'asdfasdf', avatar: defaultAvatar, isSpeaking: false,
        },
        {
            id: '5', name: 'someone', avatar: defaultAvatar, isSpeaking: false,
        },
        {
            id: '6', name: 'idk this is a lot', avatar: defaultAvatar, isSpeaking: true,
        },
        {
            id: '7', name: 'not creative', avatar: defaultAvatar, isSpeaking: true,
        },
        {
            id: '8', name: 'nr8', avatar: defaultAvatar, isSpeaking: false,
        },
        {
            id: '9', name: 'nr8', avatar: defaultAvatar, isSpeaking: false,
        },
        {
            id: '10', name: 'nr8', avatar: defaultAvatar, isSpeaking: false,
        },
        {
            id: '11', name: 'nr8', avatar: defaultAvatar, isSpeaking: false,
        },
        {
            id: '12', name: 'nr8', avatar: defaultAvatar, isSpeaking: false,
        },
        {
            id: '13', name: 'nr8', avatar: defaultAvatar, isSpeaking: false,
        },
        {
            id: '14', name: 'nr8', avatar: defaultAvatar, isSpeaking: false,
        },
    ]


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
            voiceActivity.value = {
                members:  [
                    {
                        id: '0', name: 'abc', avatar: defaultAvatar, isSpeaking: false,
                    },
                    {
                        id: '1', name: 'testnickname with a long name', avatar: defaultAvatar, isSpeaking: true,
                    },
                    {
                        id: '2', name: 'anotherone', avatar: defaultAvatar, isSpeaking: true,
                    },
                    {
                        id: '3', name: 'POGGERS', avatar: defaultAvatar, isSpeaking: false,
                    },
                    {
                        id: '4', name: 'asdfasdf', avatar: defaultAvatar, isSpeaking: false,
                    },
                    {
                        id: '5', name: 'someone', avatar: defaultAvatar, isSpeaking: false,
                    },
                    {
                        id: '6', name: 'idk this is a lot', avatar: defaultAvatar, isSpeaking: true,
                    },
                    {
                        id: '7', name: 'not creative', avatar: defaultAvatar, isSpeaking: true,
                    },
                    {
                        id: '8', name: 'nr8', avatar: defaultAvatar, isSpeaking: false,
                    },
                    {
                        id: '9', name: 'nr8', avatar: defaultAvatar, isSpeaking: false,
                    },
                    {
                        id: '10', name: 'nr8', avatar: defaultAvatar, isSpeaking: false,
                    },
                    {
                        id: '11', name: 'nr8', avatar: defaultAvatar, isSpeaking: false,
                    },
                    {
                        id: '12', name: 'nr8', avatar: defaultAvatar, isSpeaking: false,
                    },
                    {
                        id: '13', name: 'nr8', avatar: defaultAvatar, isSpeaking: false,
                    },
                    {
                        id: '14', name: 'nr8', avatar: defaultAvatar, isSpeaking: false,
                    },
                ],
            };
        }
    }
    if (nodecg.bundleConfig.discordSunshine) {
        if (!nodecg.bundleConfig.discordSunshine.test) {
            require('./discord-sunshine');
        } else {
            const voiceActivity = nodecg.Replicant<VoiceActivitySunshine>('voiceActivitySunshine', {
                defaultValue: {
                    members: [],
                },
                persistent: true,
            });
            voiceActivity.value = {
                members: discordTestMembers
            };
        }
    }
    require('./twitch-chat-bot');
    require('./gdq-donationtracker');
    require('./streams');
    require('./util/obs');
    require('./obsremotecontrol');
    if (bundleConfig.mpd && bundleConfig.mpd.enable) {
        require('./music');
    } else {
        nodecg.log.warn('MPD integration is disabled, no music!');
        nodecg.Replicant<SongData>('songData', {
            persistent: false,
            defaultValue: {playing: false, title: 'No Track Playing'}
        });
    }
    // this doesn't really belong anywhere
    // just make sure to declare
    nodecg.Replicant<ShowPictureDuringIntermission>('showPictureDuringIntermission');
    //const text = fs.readFileSync('src/graphics/host-dashboard/fhfacts.txt', 'utf-8');
};
