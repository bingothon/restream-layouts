// source: https://github.com/TreZc0/kiio-podcast

// TODO refactor this
/* eslint-disable @typescript-eslint/no-use-before-define, no-inner-declarations */

// Imports
import * as Discord from 'discord.js';
import * as Voice from '@discordjs/voice';
import {Readable} from 'stream';
import * as nodecgApiContext from './util/nodecg-api-context';
import {VoiceActivity, GameMode} from '../../schemas';
import {Configschema} from '../../configschema';
import { getVoiceConnection, VoiceConnection } from '@discordjs/voice'

const nodecg = nodecgApiContext.get();

// NodeCG
const log = new nodecg.Logger(`${nodecg.bundleName}:discord`);
const voiceActivity = nodecg.Replicant<VoiceActivity>('voiceActivity', {
    defaultValue: {
        members: [],
    },
    persistent: true,
});

// delay in ms
const voiceDelayRep = nodecg.Replicant<number>('voiceDelay', {defaultValue: 0, persistent: true});

// Discord API
const bot = new Discord.Client({intents: 32767}); // all intents cause I'm too lazy to figure out which are the correct ones

// config
const gameModeToConfigKey: Record<string, string> = {
    neutral: 'discord',
    botw: 'discord',
    sms: 'discordSunshine',
    sa2b: 'discordSA2'
};

const gameModeRep = nodecg.Replicant<GameMode>('gameMode');
const config = nodecg.bundleConfig as Configschema;
const botToken = config.discord?.token;
// @ts-ignore
let botServerID = config[gameModeToConfigKey[gameModeRep.value.game]].serverID;
// @ts-ignore
let botCommandChannelID = config[gameModeToConfigKey[gameModeRep.value.game]].commandChannelID;
// @ts-ignore
let botVoiceCommentaryChannelID = config[gameModeToConfigKey[gameModeRep.value.game]].voiceChannelID;

if (!(botToken && botServerID && botCommandChannelID && botVoiceCommentaryChannelID)) {
    log.error('botToken, botServerID, botCommandChannelID, botVoiceCommentaryChannelID all have to be set!');
} else {
    // Variables
    let voiceStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';

    let voiceConnection: VoiceConnection | undefined;

    // Connection
    bot.on('ready', (): void => {
        if (!bot.user) {
            log.error('bot user not set!!');
            return;
        }
        log.info('Logged in as %s - %s\n', bot.user.tag, bot.user.id);
        log.info('Server ID: ', botServerID);
        log.info('Command Channel ID: ', botCommandChannelID);
        log.info('Voice Channel ID: ', botVoiceCommentaryChannelID);
    });
    bot.on('error', (): void => {
        log.error('The bot encountered a connection error!!');

        voiceStatus = 'disconnected';

        setTimeout((): void => {
            bot.login(botToken);
        }, 10000);
    });

    bot.on('disconnect', (): void => {
        log.error('The bot disconnected!!');

        voiceStatus = 'disconnected';

        setTimeout((): void => {
            bot.login(botToken);
        }, 10000);
    });

    bot.login(botToken);

    // Voice
    bot.on('voiceStateUpdate', (): void => {
        updateCommentaryChannelMembers();
        // reconnect to voice channel on disconnect
        if (voiceStatus === 'disconnected') {
            joinVC();
        }
    });

    gameModeRep.on('change', (newVal, oldVal) => {
        if (newVal && oldVal && newVal.game === oldVal.game) {
            return
        }
        if (bot.isReady())
            updateDiscordConfig()
    })

    if(voiceConnection) {
        voiceConnection.receiver.speaking.on('start', () => {
            updateCommentaryChannelMembers();
        })

        voiceConnection.receiver.speaking.on('end', () => {
            updateCommentaryChannelMembers();
        })
    }

    function updateDiscordConfig(): void {
        // leave old channel
        /*try {
            getVoiceChannelSafe(botServerID, botVoiceCommentaryChannelID).leave();
        } catch (err) {
            console.log('Bot not connected')
        }*/
        voiceStatus = 'disconnected';

        // new config
        // @ts-ignore
        botServerID = config[gameModeToConfigKey[gameModeRep.value.game]].serverID;
        // @ts-ignore
        botCommandChannelID = config[gameModeToConfigKey[gameModeRep.value.game]].commandChannelID;
        // @ts-ignore
        botVoiceCommentaryChannelID = config[gameModeToConfigKey[gameModeRep.value.game]].voiceChannelID;

        joinVC();

    }

    function updateCommentaryChannelMembers(): void {
        if (!voiceActivity || !voiceActivity.value) return;

        if (bot.isReady()) {

            const memberCollection = getVoiceChannelSafe(botServerID, botVoiceCommentaryChannelID)
                .members;

            if (!memberCollection || memberCollection.size < 1) {
                voiceActivity.value.members = [];
                return;
            }

            const newVoiceArray: {
                id: string;
                name: string;
                avatar: string;
                isSpeaking: boolean;
            }[] = [];

            memberCollection.forEach((voiceMember): void => {
                // Hide our bot and muted members cause that is the restreamer
                if (config.discord?.ignoredUsers
                    && config.discord.ignoredUsers.includes(voiceMember.user.tag)) {
                    return;
                }
                if (!voiceMember.voice.mute) {
                    let userAvatar = voiceMember.user.avatarURL();

                    if (!userAvatar) {
                        userAvatar = 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png';
                    } // Default avatar

                    let speakStatus = getVoiceConnection(botServerID)?.receiver.speaking.users.has(voiceMember.id);

                    if (!speakStatus) {
                        speakStatus = false;
                    }
                    log.info(`${voiceMember.displayName} has changed their speaking status: ${speakStatus}`);
                    newVoiceArray.push({
                        id: voiceMember.displayAvatarURL(),
                        name: voiceMember.displayName,
                        avatar: userAvatar,
                        isSpeaking: speakStatus,
                    });
                }
            });

            voiceActivity.value.members = newVoiceArray;

        }
    }

    function joinVC(): void {
        voiceStatus = 'connecting';

        const guild = bot.guilds.cache.get(botServerID);

        if (guild && bot.isReady()) {

            const joinConfig = {
                guildId: botServerID,
                channelId: botVoiceCommentaryChannelID,
                selfMute: false,
                selfDeaf: false,
                group: '',
                adapterCreator: guild.voiceAdapterCreator
            }

            // @ts-expect-error Currently voice is built in mind with API v10 whereas discord.js v13 uses API v9. adapters are incompatible
            Voice.joinVoiceChannel(joinConfig);

            voiceStatus = 'connected';
            voiceConnection = getVoiceConnection(botServerID);


            class Silence extends Readable {
                // eslint-disable-next-line no-underscore-dangle
                public _read(): void {
                    this.push(Buffer.from([0xF8, 0xFF, 0xFE]));
                }
            }

            //connection.play(new Silence(), {type: 'opus'});

            updateCommentaryChannelMembers();
            nodecg.log.info('joined voice channel!');

            let connection = voiceConnection;

            if (!connection) {
                // @ts-expect-error Currently voice is built in mind with API v10 whereas discord.js v13 uses API v9.
                connection = Voice.joinVoiceChannel(joinConfig);
            }
            const receiver = connection.receiver;
            receiver.speaking.on('start', (userID) => {
                // nodecg.log.info(`updating user ${user.tag} to speaking`);
                if (!voiceActivity.value.members || voiceActivity.value.members.length < 1) {
                    return;
                }
                setTimeout((): void => {
                    voiceActivity.value.members.find((voiceMember): boolean => {
                        if (voiceMember === undefined || userID === undefined) {
                            return false;
                        }
                        if (voiceMember.id === userID) {
                            // Delay this by streamleader delay/current obs
                            // timeshift delay if its activated with setTimeout
                            // eslint-disable-next-line no-param-reassign
                            voiceMember.isSpeaking = receiver.speaking.users.has(voiceMember.id);
                            return true;
                        }

                        return false;
                    });
                }, voiceDelayRep.value);
            });

            receiver.speaking.on('end', (userID => {
                setTimeout((): void => {
                    voiceActivity.value.members.find((voiceMember): boolean => {
                        if (voiceMember === undefined || userID === undefined) {
                            return false;
                        }
                        if (voiceMember.id === userID) {
                            // Delay this by streamleader delay/current obs
                            // timeshift delay if its activated with setTimeout
                            // eslint-disable-next-line no-param-reassign
                            voiceMember.isSpeaking = receiver.speaking.users.has(voiceMember.id);
                            return true;
                        }

                        return false;
                    });
                }, voiceDelayRep.value);
            }))
        }
    }

    // Commands
    function commandChannel(message: Discord.Message): void {
        // ADMIN COMMANDS
        const command = message.content.toLowerCase();
        switch (command) {
            case "!commands":
                message.reply('ADMIN: [!bot join | !bot leave]');
                return;

            case "!bot join":
                log.info('Received Join command')
                if (voiceStatus !== 'disconnected') {
                    message.reply('I already entered the podcast channel!');
                    return;
                }
                joinVC();
                return;

            case "!bot leave":
                if (voiceStatus !== 'connected') {
                    message.reply('I\'m not in the podcast channel!');
                    return;
                }
                getVoiceConnection(botServerID)?.destroy();
                voiceStatus = 'disconnected';
                return;

            default:
                return;
        }
    }

    // Message Handling
    bot.on('message', (message: Discord.Message): void => {
        if (message.channelId === botCommandChannelID) {
            commandChannel(message);
            return;
        }
        if (message.content.toLowerCase() === '!status') {
            message.reply('Hey! I\'m online and ready to track the voice channel!');
        }
    });

    // helper
    function getVoiceChannelSafe(serverID: string, voiceChannelID: string): Discord.VoiceChannel {
        const guild = bot.guilds.cache.get(serverID);
        if (guild === undefined) {
            throw new Error('Discord Guild-ID is invalid! Was ' + serverID);
        }
        const channel = guild.channels.cache.get(voiceChannelID);
        if (channel === undefined) {
            throw new Error('Discord Voice channel ID is invalid!');
        }
        if (!(channel instanceof Discord.VoiceChannel)) {
            throw new Error('Discord Channel is not a voice channel!');
        }
        return channel as Discord.VoiceChannel;
    }
}
