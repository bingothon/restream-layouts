'use-strict';

import * as nodecgApiContext from './util/nodecg-api-context';
import { Configschema } from '../../configschema';
import { ObsDashboardAudioSources, ObsAudioSources } from '../../schemas';

// this handles dashboard utilities, all around automating the run setup process and setting everything in OBS properly ontransitions
// this uses the transparent bindings form the obs.ts in util

const nodecg  = nodecgApiContext.get();
const logger = new nodecg.Logger(`${nodecg.bundleName}:remotecontrol`);
const bundleConfig = nodecg.bundleConfig as Configschema;

const obsDashboardAudioSourcesRep = nodecg.Replicant<ObsDashboardAudioSources>('obsDashboardAudioSources');
const obsAudioSourcesRep = nodecg.Replicant<ObsAudioSources>('obsAudioSources');

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