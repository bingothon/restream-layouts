import clone from 'clone';
import { ReplicantBrowser } from 'nodecg/types/browser'; // eslint-disable-line
import Vue from 'vue';
import Vuex from 'vuex';
import { Bingoboard, BingoboardMeta, BingosyncSocket } from "../../../schemas";

Vue.use(Vuex);

const replicantNames = [
  'bingoboard',
  'bingoboardMeta',
  'bingosyncSocket',
];
const replicants: ReplicantBrowser<unknown>[] = [];

export const store = new Vuex.Store({
  state: {
    bingoboard: [] as Bingoboard,
    bingoboardMeta: {} as BingoboardMeta,
    bingosyncSocket: {} as BingosyncSocket,
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

export async function create() {
  return NodeCG.waitForReplicants(...replicants).then(() => store);
}