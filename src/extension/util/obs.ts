import obsWebsocketJs from 'obs-websocket-js';
import * as nodecgApiContext from './nodecg-api-context';
import { Configschema } from '@/configschema';
import { ObsAudioSources, ObsConnection, SoundOnTwitchStream, TwitchStreams } from '@/schemas';
import { TwitchStream } from 'types';

// this module is used to communicate directly with OBS
// and transparently handle:
//  - audio volume/mute/delay
//  - preview and current scene
//  - transitions

const nodecg = nodecgApiContext.get();
const logger = new nodecg.Logger(`${nodecg.bundleName}:obs`);
const bundleConfig = nodecg.bundleConfig as Configschema;
const previewSceneRep = nodecg.Replicant<string>('obsPreviewScene')

interface OBSTransformParams {
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    cropTop?: number,
    cropBottom?: number,
    cropLeft?: number,
    cropRight?: number,
    visible?: boolean,
};

function getStreamSrcName(idx: number): string {
    return `Stream ${idx + 1}`;
}

/*function handleStreamPosChange(obs: OBSUtility, stream: TwitchStream, streamIdx: number, currentGameLayout: CurrentGameLayout, capturePositions: CapturePositions) {
    const layoutName = currentGameLayout.path.slice(1); // leading slash we don't want
    const captureLayout = capturePositions[layoutName];
    if (captureLayout === undefined) {
        logger.error(`capture layout ${layoutName} not found!`);
        return;
    }
    const capturePos = captureLayout[`stream${streamIdx + 1}`];
    if (capturePos === undefined) {
        obs.setSourceBoundsAndCrop(getStreamSrcName(streamIdx), {visible: false});
        logger.error(`capture pos for index ${streamIdx} not found on ${layoutName}!`);
        return;
    }
    // calculate cropping, the browser source is fixed to 1920x1080
    const cropLeft = 1920 * -stream.leftPercent / 100;
    const cropTop = 1080 * -stream.topPercent / 100;
    const cropRight = 1920 * (1 - 100 / stream.widthPercent) - cropLeft;
    const cropBottom = 1080 * (1 - 100 / stream.heightPercent) - cropTop;
    // fire and forget
    obs.setSourceBoundsAndCrop(getStreamSrcName(streamIdx),
        {cropLeft, cropTop, cropRight, cropBottom, visible: true,
            x: capturePos.x,
            y: capturePos.y,
            width: capturePos.width,
            height: capturePos.height,
        });
}*/

function handleSoundChange(obs: OBSUtility, soundOnTwitchStream: SoundOnTwitchStream, streamIdx: number, newStream: TwitchStream, oldStream: TwitchStream) {
    obs.setAudioMute(getStreamSrcName(streamIdx), soundOnTwitchStream !== streamIdx);

    if (newStream.volume !== oldStream.volume) {
        obs.setAudioVolume(getStreamSrcName(streamIdx), newStream.volume);
    }
}

// Extending the OBS library with some of our own functions.
class OBSUtility extends obsWebsocketJs {
    /**
     * Change to this OBS scene.
     * @param name Name of the scene.
     */
    public changeScene(name: string): Promise<void> {
        return new Promise((resolve, reject): void => {
            this.send('SetCurrentScene', { 'scene-name': name }).then(resolve).catch((err): void => {
                logger.warn(`Cannot change OBS scene [${name}]: ${err.error}`);
                reject();
            });
        });
    }

    /**
     * Get the Volume for a source
     * @param source Name of the source which volume should be changed
     */
    public getAudioVolume(source: string): Promise<number> {
        return new Promise((resolve, reject): void => {
            this.send('GetVolume', { source }).then((resp): void => {
                resolve(resp.volume);
            }).catch((err): void => {
                reject(err);
            });
        });
    }

    /**
     * Set volume for a source
     * @param source Source which volume is changed
     * @param volume Volume from 0.0 to 1.0 (inclusive)
     */
    public setAudioVolume(source: string, volume: number): Promise<void> {
        return new Promise((resolve, reject): void => {
            this.send('SetVolume', { source, volume }).then(resolve).catch((err): void => {
                // logger.warn(`Cannot set volume [${source}]: ${err.error}`);
                reject(err);
            });
        });
    }

    public setAudioMute(source: string, mute: boolean): Promise<void> {
        return new Promise((resolve, reject): void => {
            this.send('SetMute', { source, mute }).then(resolve).catch((err): void => {
                reject(err);
            })
        });
    }

    /**
     * Update the played input from a media source
     * @param source name of the media source
     * @param url link to the stream that ffmpeg can handle, get from streamlink
     */
    public async setMediasourceUrl(source: string, url: string): Promise<void> {
        await this.send("SetSourceSettings", {
            sourceName: source,
            sourceType: "ffmpeg_source", // just to make sure
            sourceSettings: {
                input: url,
                is_local_file: false,
            }
        }).catch(e => logger.error('could not set source settings', e));
    }

    /**
     * Play or pause a media source
     * @param source name of the media source
     * @param pause whether the source should be paused now, false starts the source
     */
    public async setMediasourcePlayPause(source: string, pause: boolean): Promise<void> {
        // TODO: remove this garbage once obs-websocket-js updates to proper bindings
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        await (this).send("PlayPauseMedia", {
            sourceName: source,
            playPause: pause,
        }).catch((e: unknown) => logger.error('could not set play pause', e));
    }

    public async refreshMediasource(source: string): Promise<void> {
        // TODO: remove this garbage once obs-websocket-js updates to proper bindings
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        await (this).send("RestartMedia", {
            sourceName: source,
        }).catch((e: unknown) => logger.error('could not restart media', e));
    }

    public async setSourceBoundsAndCrop(source: string, params: OBSTransformParams): Promise<void> {
        logger.info(`updating source ${source}: `+JSON.stringify(params));
        await this.send("SetSceneItemProperties", {
            "scene-name": previewSceneRep.value || 'game',
            item: {name: source},
            position: {},
            bounds: {},
            scale: {},
            visible: params.visible,
            crop: {
                bottom: params.cropBottom,
                left: params.cropLeft,
                right: params.cropRight,
                top: params.cropTop,
            },
        }).catch(e => logger.error('could not set source settings', e));
    }

    public async setDefaultBrowserSettings(source: string): Promise<void> {
        await this.send("SetSourceSettings", {
            sourceName: source,
            sourceSettings: {
                height: 1080,
                width: 1920,
                fps: 30, // TODO: maybe 60?
                reroute_audio: true,
            }
        })
    }

    public async setBrowserSourceUrl(source: string, url: string): Promise<void> {
        // browser settings: "fps":28,"height":1080,"url":"https://obsproject.com/browser-source2","width":1920
        await this.send("SetSourceSettings", {
            sourceName: source,
            sourceSettings: {
                url,
            }
        }).catch(e => logger.error('could not set browser source settings', e));
    }

    public async refreshBrowserSource(source: string): Promise<void> {
        // outdating typings :(
        await (this).send("RefreshBrowserSource", {
            sourceName: source,
        }).catch((e: unknown) => logger.error('could not refresh browser source', e));
    }
}

const obsConnectionRep = nodecg.Replicant<ObsConnection>('obsConnection');

const obs = new OBSUtility();

if (bundleConfig.obs && bundleConfig.obs.enable) {
    // local values to make sure there is no update loop

    const obsAudioSourcesRep = nodecg.Replicant<ObsAudioSources>('obsAudioSources');
    const obsPreviewSceneRep = nodecg.Replicant<string | null>('obsPreviewScene', { defaultValue: null });
    const obsCurrentSceneRep = nodecg.Replicant<string | null>('obsCurrentScene', { defaultValue: null });
    const obsSceneListRep = nodecg.Replicant<obsWebsocketJs.Scene[] | null>('obsSceneList', { defaultValue: null });
    const soundOnTwitchStreamRep = nodecg.Replicant<SoundOnTwitchStream>('soundOnTwitchStream');

    const twitchStreams = nodecg.Replicant<TwitchStreams>('twitchStreams');

    const settings = {
        address: bundleConfig.obs.address,
        password: bundleConfig.obs.password,
    };
    logger.info('Setting up OBS connection.');
    obsConnectionRep.value.status = 'disconnected';

    // eslint-disable-next-line no-inner-declarations
    function connect(): void {
        obs.connect(settings).then((): void => {
            logger.info('OBS connection successful.');
            obsConnectionRep.value.status = 'connected';

            // we need studio mode
            obs.send('EnableStudioMode').catch((e): void => {
                logger.error("Can't set studio mode", e);
            });

            // default if they somehow not exist
            [bundleConfig.obs?.discordAudio, bundleConfig.obs?.mpdAudio, bundleConfig.obs?.streamsAudio]
                .forEach((audioSource): void => {
                    if(audioSource) {
                        if (!Object.getOwnPropertyNames(obsAudioSourcesRep.value).includes(audioSource)) {
                            obsAudioSourcesRep.value[audioSource] = {
                                volume: 0.5,
                                muted: false,
                                delay: 0,
                                volumeMultiplier: 1,
                            }
                        }
                    }
                });

            obs.send('GetPreviewScene').then((scene): void => {
                obsPreviewSceneRep.value = scene.name;
                logger.info('init update preview scene');
            }).catch((err): void => {
                logger.warn(`Cannot get preview scene: ${err.error}`);
            });

            obs.send('GetCurrentScene').then((scene): void => {
                obsCurrentSceneRep.value = scene.name;
                logger.info('init current scene');
            }).catch((err): void => {
                logger.warn(`Cannot get current scene: ${err.error}`);
            });

            obs.send('GetSceneList').then((sceneList): void => {
                obsSceneListRep.value = sceneList.scenes;
            }).catch((err): void => {
                logger.warn(`Cannot get current scene list: ${err.error}`);
            });

            // obs default browser sources
            for(let i = 0; i < 4; i++) {
                obs.setDefaultBrowserSettings(getStreamSrcName(i));
            }

            twitchStreams.on('change', (newValue, old) => {
                if (!old) return;
                for (let i = 0; i < 4; i++) {
                    const stream = newValue[i];
                    const oldStream = old[i] || {}; // old stream might be undefined
                    if (stream === undefined) {
                        // this stream should not be displayed
                        const transProps: OBSTransformParams = {
                            visible: false,
                        };
                        // fire and forget
                        obs.setSourceBoundsAndCrop(getStreamSrcName(i), transProps);
                    } else {
                        // check if the streamurl changed
                        if (stream.channel !== oldStream.channel) {
                            // fire and forget
                            obs.setBrowserSourceUrl(getStreamSrcName(i), `https://player.twitch.tv/?channel=${stream.channel}&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&volume=1`);
                        }
                        /*// check if the cropping changed
                        if (stream.widthPercent !== oldStream.widthPercent ||
                            stream.heightPercent !== oldStream.heightPercent ||
                            stream.leftPercent !== oldStream.leftPercent ||
                            stream.topPercent !== oldStream.topPercent) {
                            handleStreamPosChange(obs, stream, i, currentGameLayoutRep.value, capturePositionsRep.value);
                        } else {
                            // since this channel exists, make it visible
                            obs.setSourceBoundsAndCrop(getStreamSrcName(i), {visible: true});
                        }*/
                        handleSoundChange(obs, soundOnTwitchStreamRep.value, i, stream, oldStream);
                    }
                }
            });

            soundOnTwitchStreamRep.on('change', (newVal, old) => {
                if (old === undefined) return;

                for(let i = 0; i < 4; i++) {
                    const stream = twitchStreams.value[i];
                    if (stream === undefined) continue;
                    handleSoundChange(obs, newVal, i, stream, stream);
                }
            });

            nodecg.listenFor('streams:refreshStream', (index, callback) => {
                obs.refreshBrowserSource(getStreamSrcName(index));
                if (callback && !callback.handled) {
                    callback();
                }
            });
        }).catch((err): void => {
            logger.warn('OBS connection error.');
            logger.debug('OBS connection error:', err);
        });
    }
    connect();
    obs.on('ConnectionClosed', (): void => {
        logger.warn('OBS connection lost, retrying in 5 seconds.');
        obsConnectionRep.value.status = 'error';
        setTimeout(connect, 5000);
    });

    obs.on('error', (err): void => {
        logger.warn('OBS connection error.');
        logger.debug('OBS connection error:', err);
        obsConnectionRep.value.status = 'error';
    });

    /* Don't actually care if something changes on OBS, since everything should be handled over this
    obs.on("SourceVolumeChanged", data => {
      const sourceName = data.sourceName;
      if (Object.getOwnPropertyNames(obsAudioSourcesRep.value).includes(sourceName)) {
        if
        obsAudioSourcesRep.value[sourceName].volume = data.volume;
      }
      if (sourceName == bundleConfig.obs.discordAudio) {
        obsDiscordSoundRep.value.volume = data.volume;
      } else if (sourceName == bundleConfig.obs.mpdAudio) {
        obsMpdSoundRep.value.volume = data.volume;
      } else if (sourceName == bundleConfig.obs.streamsAudio) {
        obsStreamsSoundRep.value.volume = data.volume;
      }
    });

    obs.on("SourceMuteStateChanged", data => {
      const sourceName = data.sourceName;
      if (sourceName == bundleConfig.obs.discordAudio) {
        obsDiscordSoundRep.value.muted = data.muted;
      } else if (sourceName == bundleConfig.obs.mpdAudio) {
        obsMpdSoundRep.value.muted = data.muted;
      } else if (sourceName == bundleConfig.obs.streamsAudio) {
        obsStreamsSoundRep.value.muted = data.muted;
      }
    }) */

    obs.on('PreviewSceneChanged', (data): void => {
        obsPreviewSceneRep.value = data['scene-name'];
    });

    obs.on('SwitchScenes', (data): void => {
        obsCurrentSceneRep.value = data['scene-name'];
    });

    obs.on('ScenesChanged', (): void => {
        obs.send('GetSceneList').then((sceneList): void => {
            obsSceneListRep.value = sceneList.scenes;
        }).catch((err): void => {
            logger.warn(`Cannot get current scene list: ${err.error}`);
        });
    });

    obsAudioSourcesRep.on('change', (newVal, old): void => {
        if (old === undefined || newVal === null || newVal === old) {
            return;
        }
        Object.entries(newVal).forEach(([source, sound]): void => {
            const oldSound = old[source];
            if (!oldSound || oldSound.volume !== sound.volume || oldSound.volumeMultiplier !== sound.volumeMultiplier) {
                obs.setAudioVolume(source, sound.volume * sound.volumeMultiplier).catch((e): void => {
                    logger.warn(`Error setting Volume for [${source}] to ${sound.volume} * ${sound.volumeMultiplier}: ${e.error}`);
                });
            }
            if (!oldSound || oldSound.muted !== sound.muted) {
                obs.send('SetMute', { source, mute: sound.muted }).catch((e): void => {
                    logger.warn(`Error setting mute for [${source}] to ${sound.muted}: ${e.error}`);
                });
            }
            if (!oldSound || oldSound.delay !== sound.delay) {
                obs.send('SetSyncOffset', { source, offset: sound.delay * 1000000 }).catch((e): void => {
                    logger.warn(`Error setting audio delay for [${source}] to ${sound.delay}ms: ${e.error}`);
                });
            }
        });
    });

    obsPreviewSceneRep.on('change', (newVal, old): void => {
        if (old === undefined || newVal === null || newVal === old) {
            return;
        }
        obs.send('SetPreviewScene', { 'scene-name': newVal }).catch((e): void => {
            logger.warn(`Error setting preview scene to ${newVal}: ${e.error}`);
        });
    });

    nodecg.listenFor('obs:transition', (_data, callback): void => {
        logger.info('transitioning...');
        nodecg.sendMessage('obs:startingTransition', { scene: obsPreviewSceneRep.value });
        obs.send('TransitionToProgram', {}).then((): void => {
            if (callback && !callback.handled) {
                logger.info('transitioned!');
                callback();
            }
        }).catch((e): void => {
            logger.warn('error during transition:', e);
            if (callback && !callback.handled) {
                callback(e);
            }
        });
    });
} else {
    logger.warn('OBS is disabled');
    obsConnectionRep.value.status = 'disabled';
}


export default obs;
