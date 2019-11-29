// source: https://github.com/TreZc0/kiio-podcast

// Imports
import * as Discord from 'discord.js';
import * as nodecgApiContext from './util/nodecg-api-context';
import { VoiceActivity } from '../../schemas';
import { Configschema } from '../../configschema';
import { Readable } from 'stream';

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
const voiceDelayRep = nodecg.Replicant<number>('voiceDelay', { defaultValue: 0, persistent: true });

// Discord API
const bot = new Discord.Client();

// config
const config = nodecg.bundleConfig as Configschema;
const botToken = config.discord.token;
const botServerID = config.discord.serverID;
const botCommandChannelID = config.discord.commandChannelID;
const botVoiceCommentaryChannelID = config.discord.voiceChannelID;

if (!(botToken && botServerID && botCommandChannelID && botVoiceCommentaryChannelID)) {
  log.error('botToken, botServerID, botCommandChannelID, botVoiceCommentaryChannelID all have to be set!');
} else {
  // Variables
  let botIsReady = false;
  let voiceChannelConnection: any;

  // Connection
  bot.on('ready', () => {
    if (!bot.user) {
      log.error('bot user not set!!');
      return;
    }
    log.info('Logged in as %s - %s\n', bot.user.username, bot.user.id);

    botIsReady = true;
  });
  bot.on('error', () => {
    log.error('The bot encountered a connection error!!');

    botIsReady = false;

    setTimeout(() => {
      bot.login(botToken);
    }, 10000);
  });

  bot.on('disconnect', () => {
    log.error('The bot disconnected!!');

    botIsReady = false;

    setTimeout(() => {
      bot.login(botToken);
    }, 10000);
  });

  bot.login(botToken);

  // Voice
  bot.on('voiceStateUpdate', () => {
    UpdateCommentaryChannelMembers();
  });

  function UpdateCommentaryChannelMembers() {
    if (!voiceActivity || !voiceActivity.value) return;

    const memberArray = getVoiceChannelSafe(botServerID, botVoiceCommentaryChannelID).members.array();

    if (!memberArray || memberArray.length < 1) {
      voiceActivity.value.members = [];
      return;
    }

    const newVoiceArray: {
      id: string;
      name: string;
      avatar: string;
      isSpeaking: boolean;
    }[] = [];

    memberArray.forEach((voiceMember) => {
      // Hide our bot and muted members cause that is the restreamer
      if (config.discord.ignoredUsers && config.discord.ignoredUsers.includes(voiceMember.user.tag)) {
        return;
      }
      if (!voiceMember.voice.selfMute) {
        let userAvatar = voiceMember.user.avatarURL();

        if (!userAvatar || userAvatar == null) {
          userAvatar = 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png';
        } // Default avatar

        let speakStatus = voiceMember.voice.speaking;

        if (!speakStatus || speakStatus === null) {
          speakStatus = false;
        }
        log.info(`${voiceMember.displayName} has changed their speaking status: ${speakStatus}`);
        newVoiceArray.push({
          id: voiceMember.user.id, name: voiceMember.displayName, avatar: userAvatar, isSpeaking: speakStatus,
        });
      }
    });

    voiceActivity.value.members = newVoiceArray;
  }

  // Commands
  function commandChannel(message: Discord.Message) {
    // ADMIN COMMANDS
    if (message.content.toLowerCase() === '!commands') {
      message.reply('ADMIN: [!bot join | !bot leave]');
    } else if (message.content.toLowerCase() === '!bot join') {
      if (voiceChannelConnection) {
        message.reply('I already entered the podcast channel!');
        return;
      }

      voiceChannelConnection = getVoiceChannelSafe(botServerID, botVoiceCommentaryChannelID).join().then((connection) => {
        voiceChannelConnection = connection;
        class Silence extends Readable {
          _read(){
              this.push(Buffer.from([0xF8, 0xFF, 0xFE]))
          }
       }
       connection.play(new Silence(), {type: 'opus'});

        UpdateCommentaryChannelMembers();
        nodecg.log.info(`joined voice channel!`);
        connection.on('speaking', (user, speaking) => {
          nodecg.log.info(`updating user ${user.tag} to speaking`);
          if (!voiceActivity.value.members || voiceActivity.value.members.length < 1) { return; }
          setTimeout(() => {
            voiceActivity.value.members.find((voiceMember) => {
              if (voiceMember.id == user.id) {
                voiceMember.isSpeaking = speaking.has(Discord.Speaking.FLAGS.SPEAKING); // Delay this by streamleader delay/current obs timeshift delay if its activated with setTimeout
                return true;
              }

              return false;
            });
          }, voiceDelayRep.value);
        });
      });
    } else if (message.content.toLowerCase() === '!bot leave') {
      if (!voiceChannelConnection) {
        message.reply('I\'m not in the podcast channel!');
        return;
      }

      getVoiceChannelSafe(botServerID, botVoiceCommentaryChannelID).leave();

      voiceChannelConnection = null;
    }
  }

  // Message Handling
  bot.on('message', (message: Discord.Message) => {
    if (message.channel.id == botCommandChannelID) {
      commandChannel(message);
      return;
    }
    if (message.content.toLowerCase() == '!status') {
      message.reply('Hey! I\'m online and ready to track the voice channel!');
    }
  });

  // helper
  function getVoiceChannelSafe(serverID: string, voiceChannelID: string) {
    const guild = bot.guilds.get(serverID);
    if (guild === undefined) {
      throw new Error('Discord Guild-ID is invalid!');
    }
    const channel = guild.channels.get(voiceChannelID);
    if (channel === undefined) {
      throw new Error('Discord Voice channel ID is invalid!');
    }
    if (!(channel instanceof Discord.VoiceChannel)) {
      throw new Error('Discord Channel is not a voice channel!');
    }
    return channel as Discord.VoiceChannel;
  }
}
