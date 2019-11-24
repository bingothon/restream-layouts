'use-strict';

import * as nodecgApiContext from './util/nodecg-api-context';
import { Configschema } from '../../configschema';
import { ObsDashboardAudioSources, ObsAudioSources, ObsConnection, DiscordDelayInfo, TwitchStreams, ObsStreamMode } from '../../schemas';

// this handles dashboard utilities, all around automating the run setup process and setting everything in OBS properly ontransitions
// this uses the transparent bindings form the obs.ts in util

const nodecg  = nodecgApiContext.get();
const logger = new nodecg.Logger(`${nodecg.bundleName}:remotecontrol`);
const bundleConfig = nodecg.bundleConfig as Configschema;


const obsPreviewSceneRep = nodecg.Replicant<string | null>('obsPreviewScene');
const obsDashboardAudioSourcesRep = nodecg.Replicant<ObsDashboardAudioSources>('obsDashboardAudioSources');
const obsAudioSourcesRep = nodecg.Replicant<ObsAudioSources>('obsAudioSources');
const obsConnectionRep = nodecg.Replicant<ObsConnection>('obsConnection');
const obsStreamModeRep = nodecg.Replicant<ObsStreamMode>('obsStreamMode');
const discordDelayInfoRep = nodecg.Replicant<DiscordDelayInfo>('discordDelayInfo');

const voiceDelayRep = nodecg.Replicant<number>('voiceDelay', { defaultValue: 0, persistent: true });
const streamsReplicant = nodecg.Replicant <TwitchStreams>('twitchStreams', { defaultValue: [] });
const soundOnTwitchStream = nodecg.Replicant<number>('soundOnTwitchStream', { defaultValue: -1 });

// make sure we are connected to OBS before loading any of the functions that depend on OBS
function waitTillConnected(): Promise<void> {
    return new Promise((resolve, _) => {
        function conWait(val: ObsConnection) {
            if (val.status == "connected") {
                obsConnectionRep.removeListener("change", conWait);
                resolve();
            }
        }
        obsConnectionRep.on("change", conWait);
    });
}
waitTillConnected().then(() => {

logger.info('connected to OBS, setting up remote control utils...');

// default if they somehow not exist
[bundleConfig.obs.discordAudio, bundleConfig.obs.mpdAudio, bundleConfig.obs.streamsAudio].forEach(audioSource => {
    if (!Object.getOwnPropertyNames(obsDashboardAudioSourcesRep.value).includes(audioSource)) {
        obsDashboardAudioSourcesRep.value[audioSource] = {baseVolume: 0.5, fading: "unmuted"};
    }
});

obsDashboardAudioSourcesRep.on("change", (newVal, old) => {
    if (old === undefined || newVal == null || newVal == old) {
        // if a fading was aborted by the server crashing, make sure it's leaving that state now
        Object.values(obsDashboardAudioSourcesRep.value).forEach(soundState => {
            if (["fadein","fadeout"].includes(soundState.fading)) {
                soundState.fading = "muted";
            }
        })
        return;
    }
    Object.entries(newVal).forEach(([source, soundState]) => {
        const oldSound = old[source];
        // don't do anything if currently transitioning
        if (soundState.fading == "fadein" || soundState.fading == "fadeout") {
            return;
        }
        if (!oldSound || oldSound.baseVolume != soundState.baseVolume) {
            logger.info(`setting volume for ${source} to ${soundState.baseVolume}`);
            obsAudioSourcesRep.value[source].volume = soundState.baseVolume;
        }
        if (!oldSound || oldSound.fading != soundState.fading) {
            obsAudioSourcesRep.value[source].muted = (soundState.fading == "muted");
        }
    });
});

nodecg.listenFor('obsRemotecontrol:fadeOutAudio',(data, callback) => {
    data = data || {};
    const source = data.source;
    if (!source) {
        if (callback && !callback.handled) {
            callback("No source given!");
        }
        return;
    }
    // make sure the source exists
    if (!Object.keys(obsDashboardAudioSourcesRep.value).includes(source)) {
        if (callback && !callback.handled) {
            callback(`Source ${source} doesn't exist!`);
            return;
        }
    }
    // safety check to not have multiple fades
    if (["fadein", "fadeout"].includes(obsDashboardAudioSourcesRep.value[source].fading)) {
        if (callback && !callback.handled) {
            callback("already fading!");
        }
        return;
    }
    obsDashboardAudioSourcesRep.value[source].fading = "fadeout";
    let currentVol = obsDashboardAudioSourcesRep.value[source].baseVolume;
    obsAudioSourcesRep.value[source].muted = false;
    function doFadeOut() {
        currentVol = Math.max(currentVol - 0.05, 0);
        obsAudioSourcesRep.value[source].volume = currentVol;
        if (currentVol > 0) {
            setTimeout(doFadeOut, 100);
        } else {
            obsDashboardAudioSourcesRep.value[source].fading = "muted";
            if (callback && !callback.handled) {
                callback();
            }
            return;
        }
    }
    setTimeout(doFadeOut, 100);
});

nodecg.listenFor('obsRemotecontrol:fadeInAudio',(data, callback) => {
    data = data || {};
    const source = data.source;
    if (!source) {
        if (callback && !callback.handled) {
            callback("No source given!");
            return;
        }
    }
    // make sure the source exists
    if (!Object.keys(obsDashboardAudioSourcesRep.value).includes(source)) {
        if (callback && !callback.handled) {
            callback(`Source ${source} doesn't exist!`);
            return;
        }
    }
    // safety check to not have multiple fades
    if (["fadein", "fadeout"].includes(obsDashboardAudioSourcesRep.value[source].fading)) {
        if (callback && !callback.handled) {
            callback("already fading!");
        }
        return;
    }
    obsDashboardAudioSourcesRep.value[source].fading = "fadein";
    obsAudioSourcesRep.value[source].muted = false;
    let currentVol = 0;
    function doFadeIn() {
        const goalVol = obsDashboardAudioSourcesRep.value[source].baseVolume;
        currentVol = Math.min(goalVol, currentVol + 0.05);
        obsAudioSourcesRep.value[source].volume = currentVol;
        if (currentVol < goalVol) {
            setTimeout(doFadeIn, 100);
        } else {
            obsDashboardAudioSourcesRep.value[source].fading = "unmuted";
        }
    }
    setTimeout(doFadeIn, 100);
});

// update discord display and audio delays to the stream leader delay for the specified delay info
function updateDiscordDelays(streamLeaderDelayMs: number | null, discordDelayInfo: DiscordDelayInfo) {
    if (discordDelayInfo.discordAudioDelaySyncStreamLeader && streamLeaderDelayMs != null) {
        if (Math.abs(obsAudioSourcesRep.value[bundleConfig.obs.discordAudio].delay - streamLeaderDelayMs) > 1000) {
            obsAudioSourcesRep.value[bundleConfig.obs.discordAudio].delay = streamLeaderDelayMs;
            if (discordDelayInfo.discordDisplayDelaySyncStreamLeader) {
                voiceDelayRep.value = streamLeaderDelayMs;
            }
        }
    } else {
        obsAudioSourcesRep.value[bundleConfig.obs.discordAudio].delay = discordDelayInfo.discordAudioDelayMs;
    }
    // already handled
    if (discordDelayInfo.discordDisplayDelaySyncStreamLeader && !discordDelayInfo.discordAudioDelaySyncStreamLeader && streamLeaderDelayMs != null) {
        voiceDelayRep.value = streamLeaderDelayMs;
    } else {
        voiceDelayRep.value = discordDelayInfo.discordDisplayDelayMs;
    }
}

discordDelayInfoRep.on('change', newVal => {
    let streamLeaderDelayMs = null;
    if (soundOnTwitchStream.value != -1) {
        streamLeaderDelayMs = streamsReplicant.value[soundOnTwitchStream.value].delay;
    }
    updateDiscordDelays(streamLeaderDelayMs, newVal);
});

soundOnTwitchStream.on('change', newVal => {
    if (newVal == -1) {
        return;
    }
    updateDiscordDelays(streamsReplicant.value[newVal].delay, discordDelayInfoRep.value);
});

streamsReplicant.on('change', newVal => {
    if (soundOnTwitchStream.value == -1) {
        return;
    }
    updateDiscordDelays(newVal[soundOnTwitchStream.value].delay, discordDelayInfoRep.value);
});

function handleScreenStreamModeChange(streamMode: ObsStreamMode, nextSceneName: string) {
    // depending on the next scene and which mode is used set some stuff automagically
    if (streamMode == "external-commentary" || streamMode == "runner-commentary") {
        // if commentary is external no delay is necessary
        if (streamMode == "external-commentary") {
            discordDelayInfoRep.value.discordAudioDelaySyncStreamLeader = false;
            discordDelayInfoRep.value.discordDisplayDelaySyncStreamLeader = false;
        }
        // if going to a game screen, unmute the game, otherwise mute
        // probably not needed anymore?
        if (nextSceneName == "game") {
            nodecg.sendMessage('fadeInAudio', {source: bundleConfig.obs.streamsAudio}, err => {
                logger.warn(`Problem fading in streams during transition: ${err.error}`);
            });
        } else {
            nodecg.sendMessage('fadeOutAudio', {source: bundleConfig.obs.streamsAudio}, err => {
                logger.warn(`Problem fading out streams during transition: ${err.error}`);
            });
        }
        // if the next scene isn't intermission unmute discord
        if (nextSceneName == 'intermission') {
            nodecg.sendMessage('fadeOutAudio', {source: bundleConfig.obs.discordAudio}, err => {
                logger.warn(`Problem fading out discord during transition: ${err.error}`);
            });
        } else {
            nodecg.sendMessage('fadeInAudio', {source: bundleConfig.obs.discordAudio}, err => {
                logger.warn(`Problem fading in discord during transition: ${err.error}`);
            });
        }
    } else if(streamMode == "racer-audio-only") {
        // use player audio
        /*if (nextSceneName.includes('x')) {
            soundOnTwitchStream.value = 0;
        } else {
            soundOnTwitchStream.value = -1;
        }*/
        // discord muted exept for interview
        if (nextSceneName == 'interview') {
            nodecg.sendMessage('fadeOutAudio', {source: bundleConfig.obs.streamsAudio}, err => {
                logger.warn(`Problem fading out streams during transition: ${err.error}`);
            });
        } else {
            nodecg.sendMessage('fadeInAudio', {source: bundleConfig.obs.streamsAudio}, err => {
                logger.warn(`Problem fading in streams during transition: ${err.error}`);
            });
        }
    } else {
        nodecg.log.error('Unknown stream configuration: '+streamMode);
    }
}

obsStreamModeRep.on('change', (newVal, old)=>{
    // no value is most likely server restart
    if (!old) return;
    // change in current scene
    handleScreenStreamModeChange(newVal, obsPreviewSceneRep.value || "");
});

});