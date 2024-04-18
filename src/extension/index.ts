import {NodeCG} from 'nodecg/types/server'; // eslint-disable-line
import * as nodecgApiContext from './util/nodecg-api-context';
import {ShowPictureDuringIntermission, SongData, VoiceActivity} from '@/schemas';
// import {requireService} from "nodecg-io-core";
// import { StreamElementsServiceClient } from "nodecg-io-streamelements";

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
    require('./smsBingoImport');

    const defaultAvatar = 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png';


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
    require('./twitch-chat-bot');
    require('./util/obs');
    require('./obsremotecontrol');
    if(bundleConfig.twitchEventSub && bundleConfig.twitchEventSub.enabled){
        require('./twitchEventSub');
    }
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

/*
    //idk where to put this lol
    const streamElements = requireService<StreamElementsServiceClient>(nodecg, "streamelements");

    streamElements?.onAvailable((client) => {
        nodecg.log.info("SE client has been updated, registering handlers now.");

        client.onCheer((data) => {
            nodecg.log.info(
                `${data.data.displayName} just cheered ${data.data.amount} bit(s). Message: ${data.data.message}`,
            );
        });

        client.onFollow((data) => {
            nodecg.log.info(`${data.data.displayName} just followed.`);
        });

        client.onSubscriber((data) => {
            if (data.data.tier) {
                const tier =
                    data.data.tier === "prime" ? "Twitch Prime" : "Tier " + Number.parseInt(data.data.tier) / 1000;
                nodecg.log.info(`${data.data.displayName} just subscribed for ${data.data.amount} months (${tier}).`);
            }
        });

        client.onGift((data) => {
            if (data.data.tier) {
                const tier = (Number.parseInt(data.data.tier) / 1000).toString();
                if (data.data.sender) {
                    nodecg.log.info(
                        `${data.data.displayName} just got a tier ${tier} subscription from ${data.data.sender}! It's ${data.data.displayName}'s ${data.data.amount} month.`,
                    );
                } else {
                    nodecg.log.info(
                        `${data.data.displayName} just got a tier ${tier} subscription! It's ${data.data.displayName}'s ${data.data.amount} month.`,
                    );
                }
            }
        });

        client.onHost((data) => {
            nodecg.log.info(`${data.data.displayName} just hosted the stream for ${data.data.amount} viewer(s).`);
        });

        client.onRaid((data) => {
            nodecg.log.info(`${data.data.displayName} just raided the stream with ${data.data.amount} viewers.`);
        });

        client.onTip((data) => {
            if (data.data.currency) {
                nodecg.log.info(
                    `${data.data.username} just donated ${data.data.amount} ${data.data.currency}. Message. ${data.data.message}`,
                );
            }
        });
    });

    streamElements?.onUnavailable(() => nodecg.log.info("SE client has been unset."));
    */
};
