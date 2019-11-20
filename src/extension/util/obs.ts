import obsWebsocketJs from 'obs-websocket-js';
import * as nodecgApiContext from './nodecg-api-context';
import { Configschema } from '../../../configschema';

const nodecg  = nodecgApiContext.get();
const logger = new nodecg.Logger(`${nodecg.bundleName}:obs`);
const bundleConfig = nodecg.bundleConfig as Configschema;

// Extending the OBS library with some of our own functions.
class OBSUtility extends obsWebsocketJs {
	constructor() {
		super();
	}

	/**
	 * Change to this OBS scene.
	 * @param name Name of the scene.
	 */
	changeScene(name: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.send('SetCurrentScene', { 'scene-name': name }).then(resolve).catch((err) => {
				logger.warn(`Cannot change OBS scene [${name}]: ${err.error}`);
				reject();
			});
		});
	}

	/**
	 * Get the Volume for a source
	 * @param source Name of the source which volume should be changed
	 */
	getAudioVolume(source: string): Promise<number> {
		return new Promise((resolve, reject) => {
			this.send("GetVolume", {source}).then(resp => {
				resolve(resp.volume);
			}).catch(err => {
				reject(err);
			})
		});
	}

	/**
	 * Set volume for a source
	 * @param source Source which volume is changed
	 * @param volume Volume from 0.0 to 1.0 (inclusive)
	 */
	setAudioVolume(source: string, volume: number): Promise<void> {
		return new Promise((resolve, reject) => {
			this.send("SetVolume", {source, volume}).then(resolve).catch(err => {
				// logger.warn(`Cannot set volume [${source}]: ${err.error}`);
				reject(err);
			})
		});
	}
}

const obs = new OBSUtility();

if (bundleConfig.obs && bundleConfig.obs.enable) {
	// local values to make sure there is no update loop

	const obsMpdVolumeRep = nodecg.Replicant<number | null>('obsMpdVolume', {defaultValue: null});
	const obsDiscordVolumeRep = nodecg.Replicant<number | null>('obsDiscordVolume', {defaultValue: null});
	const obsStreamsVolumeRep = nodecg.Replicant<number | null>('obsStreamsVolume', {defaultValue: null});
	const obsPreviewSceneRep = nodecg.Replicant<string | null>('obsPreviewScene', {defaultValue: null});
	const obsCurrentSceneRep = nodecg.Replicant<string | null>('obsCurrentScene', {defaultValue: null});
	const obsSceneListRep = nodecg.Replicant<obsWebsocketJs.Scene[] | null>('obsSceneList', {defaultValue: null});

	const settings = {
		address: bundleConfig.obs.address,
		password: bundleConfig.obs.password,
	};
	logger.info('Setting up OBS connection.');

	function connect() {
		obs.connect(settings).then(() => {
			logger.info('OBS connection successful.');

			// we need studio mode
			obs.send("EnableStudioMode").catch(e => {
				logger.error("Can't set studio mode", e);
			});

			// check all info from OBS at startup, to not miss anything during disconnects
			obs.getAudioVolume(bundleConfig.obs.discordAudio).then(volume => {
				obsDiscordVolumeRep.value = volume;
				logger.info('init vol update dicord');
			}).catch(err => {
				logger.warn(`Cannot get volume [${bundleConfig.obs.discordAudio}]: ${err.error}`);
			});

			obs.getAudioVolume(bundleConfig.obs.mpdAudio).then(volume => {
				obsMpdVolumeRep.value = volume;
				logger.info('init vol update mpd');
			}).catch(err => {
				logger.warn(`Cannot get volume [${bundleConfig.obs.mpdAudio}]: ${err.error}`);
			});

			obs.getAudioVolume(bundleConfig.obs.streamsAudio).then(volume => {
				obsStreamsVolumeRep.value = volume;
				logger.info('init vol update streams');
			}).catch(err => {
				logger.warn(`Cannot get volume [${bundleConfig.obs.streamsAudio}]: ${err.error}`);
			});

			obs.send("GetPreviewScene").then(scene => {
				obsPreviewSceneRep.value = scene.name;
				logger.info('init update preview scene');
			}).catch(err => {
				logger.warn(`Cannot get preview scene: ${err.error}`);
			});

			obs.send("GetCurrentScene").then(scene => {
				obsCurrentSceneRep.value = scene.name;
				logger.info('init current scene');
			}).catch(err => {
				logger.warn(`Cannot get current scene: ${err.error}`);
			});

			obs.send("GetSceneList").then(sceneList => {
				obsSceneListRep.value = sceneList.scenes;
			}).catch(err => {
				logger.warn(`Cannot get scene list: ${err.error}`);
			});
		}).catch((err) => {
			logger.warn('OBS connection error.');
			logger.debug('OBS connection error:', err);
		});
	}
	connect();
	obs.on('ConnectionClosed', () => {
		logger.warn('OBS connection lost, retrying in 5 seconds.');
		setTimeout(connect, 5000);
	});

	// @ts-ignore: Pretty sure this emits an error.
	obs.on('error', (err) => {
		logger.warn('OBS connection error.');
		logger.debug('OBS connection error:', err);
	});

	obs.on("SourceVolumeChanged", data => {
		const sourceName = data.sourceName;
		logger.info('source volume changed:', data);
		if (sourceName == bundleConfig.obs.discordAudio) {
			obsDiscordVolumeRep.value = data.volume;
		} else if (sourceName == bundleConfig.obs.mpdAudio) {
			obsMpdVolumeRep.value = data.volume;
		} else if (sourceName == bundleConfig.obs.streamsAudio) {
			obsStreamsVolumeRep.value = data.volume;
		}
	});

	obs.on("PreviewSceneChanged", data => {
		obsPreviewSceneRep.value = data["scene-name"];
	});

	obs.on("SwitchScenes", data => {
		obsCurrentSceneRep.value = data["scene-name"];
	});

	obsMpdVolumeRep.on('change', (newVal, old) => {
		logger.info('volume update mpd');
		if (old === undefined || newVal == null || newVal == old) {
			return;
		}
		obs.setAudioVolume(bundleConfig.obs.mpdAudio, newVal).catch(e => {
			logger.warn(`Error setting MPD Volume: ${e.error}`);
		});
	});

	obsDiscordVolumeRep.on('change', (newVal, old) => {
		if (old === undefined || newVal == null || newVal == old) {
			return;
		}
		obs.setAudioVolume(bundleConfig.obs.discordAudio, newVal).catch(e => {
			logger.warn(`Error setting discord Volume: ${e.error}`);
		});
	});

	obsStreamsVolumeRep.on('change', (newVal, old) => {
		if (old === undefined || newVal == null || newVal == old) {
			return;
		}
		obs.setAudioVolume(bundleConfig.obs.streamsAudio, newVal).catch(e => {
			logger.warn(`Error setting streams Volume: ${e.error}`);
		});
	});

	obsPreviewSceneRep.on('change', (newVal, old) => {
		if (old === undefined || newVal == null || newVal == old) {
			return;
		}
		obs.send("SetPreviewScene",{"scene-name":newVal}).catch(e => {
			logger.warn(`Error setting preview scene to ${newVal}: ${e.error}`);
		})
	});
	
	nodecg.listenFor('obs:transition', (_data, callback) => {
		logger.info('transitioning...')
		//
		obs.send("TransitionToProgram", {"with-transition":{name: "invalid"}}).then(() => {
			if (callback && !callback.handled) {
				logger.info('transitioned!')
				callback();
			}
		}).catch(e => {
			logger.warn('error during transition:',e);
			if (callback && !callback.handled) {
				callback(e);
			}
		})
	});
} else {
	logger.warn('OBS is disabled');
}


export default obs;
