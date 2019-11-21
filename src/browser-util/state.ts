import clone from 'clone';
import { ReplicantBrowser } from 'nodecg/types/browser'; // eslint-disable-line
import Vue from 'vue';
import Vuex from 'vuex';
import { AllGameLayouts, AllInterviews, Bingoboard, BingoboardMeta, BingosyncSocket, CurrentGameLayout, CurrentInterview, DonationTotal, TrackerOpenBids, TrackerDonations, VoiceActivity, TrackerPrizes, SongData, CurrentMainBingoboard, HostingBingoboard, HostingBingosocket, OriBingoboard, OriBingoMeta, ExplorationBingoboard, TwitchStreams, SoundOnTwitchStream } from "../../schemas";
import { RunDataActiveRun, RunDataArray, Timer } from "../../speedcontrol-types";
import {Scene} from 'obs-websocket-js';
import { ObsSound } from '../../types/ObsSound';

Vue.use(Vuex);

const replicantNames = [
  'allGameLayouts',
  'allInterviews',
  'bingoboard',
  'bingoboardMeta',
  'bingosyncSocket',
  'currentGameLayout',
  'currentInterview',
  'currentMainBingoboard',
  'donationTotal',
  'explorationBingoboard',
  'hostingBingoboard',
  'hostingBingosocket',
  'obsMpdSound',
	'obsDiscordSound',
	'obsStreamsSound',
	'obsPreviewScene',
	'obsCurrentScene',
	'obsSceneList',
  'oriBingoboard',
  'oriBingoMeta',
  'soundOnTwitchStream',
  'trackerDonations',
  'trackerOpenBids',
  'trackerPrizes',
  'twitchStreams',
  'voiceActivity',
  'songData'
];
const nodecgSpeedcontrolReplicantNames = [
  'runDataActiveRun',
  'runDataArray',
  'timer'
]
const replicants: Map<string,ReplicantBrowser<any>> = new Map();

var playerAlternateInterval: NodeJS.Timeout | null = null;

export const store = new Vuex.Store({
  state: {
    // bingothon
    allGameLayouts: [] as AllGameLayouts,
	allInterviews: [] as AllInterviews,
    bingoboard: {} as Bingoboard,
    bingoboardMeta: {} as BingoboardMeta,
    bingosyncSocket: {} as BingosyncSocket,
    currentGameLayout: {} as CurrentGameLayout,
	currentInterview: {} as CurrentInterview,
    currentMainBingoboard: {} as CurrentMainBingoboard,
    donationTotal: 0 as DonationTotal,
    explorationBingoboard: {} as ExplorationBingoboard,
    hostingBingoboard: {} as HostingBingoboard,
    hostingBingosocket: {} as HostingBingosocket,
    obsMpdSound: {} as ObsSound,
    obsDiscordSound: {} as ObsSound,
    obsStreamsSound: {} as ObsSound,
    obsPreviewScene: null as null | string,
    obsCurrentScene: null as null | string,
    obsSceneList: null as null | Scene[],
    oriBingoboard: {} as OriBingoboard,
    oriBingoMeta: {} as OriBingoMeta,
    soundOnTwitchStream: 0 as SoundOnTwitchStream,
    trackerDonations: [] as TrackerDonations,
    trackerOpenBids: [] as TrackerOpenBids,
    trackerPrizes: [] as TrackerPrizes,
    twitchStreams: [] as TwitchStreams,
    voiceActivity: {} as VoiceActivity,
    songData: {} as SongData,
    // nodecg-speedcontrol
    runDataActiveRun: {} as RunDataActiveRun,
    runDataArray: [] as RunDataArray,
    timer: {} as Timer,
    // timer
    playerAlternate: true,
  },
  mutations: {
    updateReplicant(state, { name, value }) {
      Vue.set(state, name, value);
    },
    startPlayerAlternateInterval(state, interval) {
      if (playerAlternateInterval) {
        clearInterval(playerAlternateInterval);
      }
      playerAlternateInterval = setInterval(() => {
        Vue.set(state, 'playerAlternate', !state.playerAlternate);
      }, interval);
    },
    stopPlayerAlternateInterval(state) {
      if (playerAlternateInterval) {
        clearInterval(playerAlternateInterval);
      }
      playerAlternateInterval = null;
    }
  },
});

store.commit('startPlayerAlternateInterval', 10000);

/**
 * Gets the raw replicant, only intended for modifications, to use values use state
 * @param replicant name of the replicant, throws an error if it isn't found
 */
export function getReplicant<T>(replicant: string): ReplicantBrowser<T> {
  const rep = replicants.get(replicant);
  if (!rep) {
    throw new Error("invalid replicant!");
  }
  return rep;
}

replicantNames.forEach((name) => {
  const replicant = nodecg.Replicant(name);

  replicant.on('change', (newVal) => {
    store.commit('updateReplicant', {
      name: replicant.name,
      value: clone(newVal),
    });
  });

  replicants.set(name,replicant);
});

nodecgSpeedcontrolReplicantNames.forEach(name => {
  const rep = nodecg.Replicant(name, 'nodecg-speedcontrol');

  rep.on('change', newVal => {
    store.commit('updateReplicant', {
      name: rep.name,
      value: clone(newVal),
    });
  });

  replicants.set(name,rep);
})

export async function create() {
  return NodeCG.waitForReplicants(...Array.from(replicants.values())).then(() => store);
}
