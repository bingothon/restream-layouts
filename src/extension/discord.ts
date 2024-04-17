// source: https://github.com/TreZc0/kiio-podcast

// TODO refactor this
/* eslint-disable @typescript-eslint/no-use-before-define, no-inner-declarations */

// Imports
import * as Discord from 'discord.js';
import * as Voice from '@discordjs/voice';
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

if(!voiceDelayRep.value) {
    voiceDelayRep.value = 0;
}

// Discord API
const bot = new Discord.Client({intents: 32767}); // all intents cause I'm too lazy to figure out which are the correct ones

// enum is needed otherwise ts will complain about the keys
enum discordConfigKeys {
    discord = 'discord',
    discordSunshine = 'discordSunshine',
    discordSA2 = 'discordSA2'
}

// config
const gameModeToConfigKey: Record<string, discordConfigKeys> = {
    neutral: discordConfigKeys.discord,
    botw: discordConfigKeys.discord,
    sms: discordConfigKeys.discordSunshine,
    sa2b: discordConfigKeys.discordSA2
};

const gameModeRep = nodecg.Replicant<GameMode>('gameMode');
const config = nodecg.bundleConfig as Configschema;
const botToken = config.discord?.token;

let botServerID = config[gameModeToConfigKey[gameModeRep.value.game]]?.serverID || '';
let botCommandChannelID = config[gameModeToConfigKey[gameModeRep.value.game]]?.commandChannelID || '';
let botVoiceCommentaryChannelID = config[gameModeToConfigKey[gameModeRep.value.game]]?.voiceChannelID || '';

if (!(botToken && botServerID && botCommandChannelID && botVoiceCommentaryChannelID)) {
    log.error('botToken, botServerID, botCommandChannelID, botVoiceCommentaryChannelID all have to be set!');
} else {
    // Variables
    let voiceStatus: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected';

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

        voiceStatus = 'error';

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
        if (voiceStatus === 'error') {
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

    function updateDiscordConfig(): void {
        // leave old channel
        try {
            getVoiceConnection(botServerID)?.disconnect();
        } catch (err) {
            console.log('Bot not connected')
        }
        voiceStatus = 'disconnected';

        // new config
        botServerID = config[gameModeToConfigKey[gameModeRep.value.game]]?.serverID || '';
        botCommandChannelID = config[gameModeToConfigKey[gameModeRep.value.game]]?.commandChannelID || '';
        botVoiceCommentaryChannelID = config[gameModeToConfigKey[gameModeRep.value.game]]?.voiceChannelID || '';

        if (!(botToken && botServerID && botCommandChannelID && botVoiceCommentaryChannelID)) {
            log.error('botToken, botServerID, botCommandChannelID, botVoiceCommentaryChannelID all have to be set!');
            return;
        }

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
                    let userAvatar = voiceMember.displayAvatarURL();

                    if (!userAvatar) {
                        userAvatar = 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png';
                    } // Default avatar

                    let speakStatus = getVoiceConnection(botServerID)?.receiver.speaking.users.has(voiceMember.id);

                    if (!speakStatus) {
                        speakStatus = false;
                    }
                    log.info(`${voiceMember.displayName} has changed their speaking status: ${speakStatus}`);
                    newVoiceArray.push({
                        id: voiceMember.id,
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

            if(voiceConnection) {
                voiceConnection.receiver.speaking.on('start', () => {
                    nodecg.log.info('User started speaking');
                    updateCommentaryChannelMembers();
                })
        
                voiceConnection.receiver.speaking.on('end', () => {
                    nodecg.log.info('User stopped speaking');
                    updateCommentaryChannelMembers();
                })
            }

            updateCommentaryChannelMembers();
            nodecg.log.info('joined voice channel!');

            let connection = voiceConnection;

            if (!connection) {
                // @ts-expect-error Currently voice is built in mind with API v10 whereas discord.js v13 uses API v9.
                connection = Voice.joinVoiceChannel(joinConfig);
            }
            const receiver = connection.receiver;
            receiver.speaking.on('start', (userID) => {
                if (!voiceActivity.value.members || voiceActivity.value.members.length < 1) {
                    return;
                }
                setTimeout((): void => {
                    const member = voiceActivity.value.members.find((voiceMember) => {
                        return voiceMember.id == userID;
                    });
                    if (member) {
                        // Ignoring the double check from receiver.speaking, user should be speaking anyways
                        member.isSpeaking = true;
                    }
                }, voiceDelayRep.value);
            });

            receiver.speaking.on('end', (userID => {
                setTimeout((): void => {
                    const member = voiceActivity.value.members.find((voiceMember) => {
                        return voiceMember.id === userID;
                    });
                    if (member) {
                        member.isSpeaking = false;
                    }
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
                getVoiceConnection(botServerID)?.disconnect();
                getVoiceConnection(botServerID)?.destroy();
                voiceStatus = 'disconnected';
                return;

            default:
                return;
        }
    }

    // Message Handling
    bot.on('messageCreate', (message: Discord.Message): void => {
        if (message.channelId === botCommandChannelID) {
            if (message.content.toLowerCase() === '!status') {
                switch (voiceStatus) {
                    case 'disconnected':
                        message.reply('I\'m not in the podcast channel!');
                        break;
                    case 'connecting':
                        message.reply('I\'m currently connecting to the podcast channel!');
                        break;
                    case 'connected':
                        message.reply('I\'m currently in the podcast channel!');
                        break;
                }
                message.reply('Hey! I\'m online and ready to track the voice channel!');
                return;
            }
            commandChannel(message);
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
