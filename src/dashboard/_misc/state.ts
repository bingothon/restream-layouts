import clone from 'clone';
import { ReplicantBrowser } from 'nodecg/types/browser'; // eslint-disable-line
import Vue from 'vue';
import Vuex from 'vuex';
import { Bingoboard, BingoboardMeta, BingosyncSocket, DonationTotal, TrackerOpenBids, TrackerDonations } from "../../../schemas";
import { RunDataActiveRun, RunDataArray } from "../../../speedcontrol-types";

Vue.use(Vuex);

const replicantNames = [
  'bingoboard',
  'bingoboardMeta',
  'bingosyncSocket',
  'donationTotal',
  'trackerDonations',
  'trackerOpenBids',
];
const nodecgSpeedcontrolReplicantNames = [
  'runDataActiveRun',
  'runDataArray',
]
const replicants: ReplicantBrowser<unknown>[] = [];

export const store = new Vuex.Store({
  state: {
    // bingothon
    bingoboard: [] as Bingoboard,
    bingoboardMeta: {} as BingoboardMeta,
    bingosyncSocket: {} as BingosyncSocket,
    donationTotal: 0 as DonationTotal,
    trackerDonations: [] as TrackerDonations,
    trackerOpenBids: [] as TrackerOpenBids,
    // nodecg-speedcontrol
    runDataActiveRun: {} as RunDataActiveRun,
    runDataArray: [] as RunDataArray,
  },
  mutations: {
    updateReplicant(state, { name, value }) {
      Vue.set(state, name, value);
    },
  },
});

replicantNames.forEach((name) => {
  const replicant = nodecg.Replicant(name);

  replicant.on('change', (newVal) => {
    store.commit('updateReplicant', {
      name: replicant.name,
      value: clone(newVal),
    });
  });

  replicants.push(replicant);
});

nodecgSpeedcontrolReplicantNames.forEach(name => {
  const rep = nodecg.Replicant(name, 'nodecg-speedcontrol');

  rep.on('change', newVal => {
    store.commit('updateReplicant', {
      name: rep.name,
      value: clone(newVal),
    });
  });

  replicants.push(rep);
})

export async function create() {
  return NodeCG.waitForReplicants(...replicants).then(() => store);
}