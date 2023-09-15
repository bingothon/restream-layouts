import clone from 'clone'
import { ReplicantBrowser } from 'nodecg/types/browser' // eslint-disable-line
import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firebaseAction } from 'vuexfire'
import { db } from './firebase'
import {
    AllCamNames,
    AllGameLayouts,
    AllInterviews,
    BestOfX,
    Bingoboard,
    BingoboardMeta,
    BingoboardMode,
    BingosyncSocket,
    CountdownTimer,
    CurrentCamNames,
    CurrentGameLayout,
    CurrentInterview,
    CurrentMainBingoboard,
    DiscordDelayInfo,
    DiscordDelayInfoSunshine,
    DonationTotal,
    ExplorationBingoboard,
    GameMode,
    HostingBingosocket,
    HostsSpeakingDuringIntermission,
    LastIntermissionTimestamp,
    ObsAudioSources,
    ObsConnection,
    ObsDashboardAudioSources,
    ObsStreamMode,
    OriBingoboard,
    OriBingoMeta,
    ShowPictureDuringIntermission,
    SongData,
    SoundOnTwitchStream,
    TrackerData,
    TrackerDonations,
    TrackerOpenBids,
    TrackerPrizes,
    TwitchStreams,
    VoiceActivity,
    VoiceActivitySunshine,
} from '../../schemas'
import { RunDataActiveRun, RunDataArray, Timer } from '../../speedcontrol-types'
import { Scene } from 'obs-websocket-js'
import { Games } from '../../types'

Vue.use(Vuex)

const replicantNames = [
    'allGameLayouts',
    'allInterviews',
    'allCamNames',
    'bestOfX',
    'bingoboard',
    'bingoboardMeta',
    'bingoboardMode',
    'bingosyncSocket',
    'countdownTimer',
    'currentGameLayout',
    'currentInterview',
    'currentCamNames',
    'currentMainBingoboard',
    'donationTotal',
    'discordDelayInfo',
    'discordDelayInfoSunshine',
    'explorationBingoboard',
    'gameMode',
    'hostingBingosocket',
    'hostsSpeakingDuringIntermission',
    'lastIntermissionTimestamp',
    'obsAudioSources',
    'obsConnection',
    'obsDashboardAudioSources',
    'obsPreviewScene',
    'obsCurrentScene',
    'obsSceneList',
    'obsStreamMode',
    'oriBingoboard',
    'oriBingoMeta',
    'showPictureDuringIntermission',
    'soundOnTwitchStream',
    'trackerDonations',
    'trackerOpenBids',
    'trackerPrizes',
    'twitchStreams',
    'voiceActivity',
    'voiceActivitySunshine',
    'songData',
    'trackerData',
]
const nodecgSpeedcontrolReplicantNames = ['runDataActiveRun', 'runDataArray', 'timer']
const replicants: Map<string, ReplicantBrowser<any>> = new Map()

var playerAlternateInterval: NodeJS.Timeout | null = null

interface StoreTypes {
    // bingothon
    allGameLayouts: AllGameLayouts
    allInterviews: AllInterviews
    allCamNames: AllCamNames
    bestOfX: BestOfX
    bingoboard: Bingoboard
    bingoboardMeta: BingoboardMeta
    bingoboardMode: BingoboardMode
    bingosyncSocket: BingosyncSocket
    countdownTimer: CountdownTimer
    currentGameLayout: CurrentGameLayout
    currentInterview: CurrentInterview
    currentCamNames: CurrentCamNames
    currentMainBingoboard: CurrentMainBingoboard
    discordDelayInfo: DiscordDelayInfo
    discordDelayInfoSunshine: DiscordDelayInfoSunshine
    donationTotal: DonationTotal
    explorationBingoboard: ExplorationBingoboard
    gameMode: GameMode
    hostingBingosocket: HostingBingosocket
    hostsSpeakingDuringIntermission: HostsSpeakingDuringIntermission
    lastIntermissionTimestamp: LastIntermissionTimestamp
    obsAudioSources: ObsAudioSources
    obsConnection: ObsConnection
    obsDashboardAudioSources: ObsDashboardAudioSources
    obsPreviewScene: null | string
    obsCurrentScene: null | string
    obsSceneList: null | any // sorry i had to do it to test any was Scene[]
    obsStreamMode: ObsStreamMode
    oriBingoboard: OriBingoboard
    oriBingoMeta: OriBingoMeta
    showPictureDuringIntermission: ShowPictureDuringIntermission
    soundOnTwitchStream: SoundOnTwitchStream
    trackerData: TrackerData
    trackerDonations: TrackerDonations
    trackerOpenBids: TrackerOpenBids
    trackerPrizes: TrackerPrizes
    twitchStreams: TwitchStreams
    voiceActivity: VoiceActivity
    voiceActivitySunshine: VoiceActivitySunshine
    songData: SongData
    // nodecg-speedcontrol
    runDataActiveRun: RunDataActiveRun
    runDataArray: RunDataArray
    timer: Timer
    // timer
    playerAlternate: true
    //firebase
    gameP1: Games
    gameP2: Games
    gameP3: Games
    gameP4: Games
}

export const store = new Vuex.Store<StoreTypes>({
    state: {
        // bingothon
        allGameLayouts: [] as AllGameLayouts,
        allInterviews: [] as AllInterviews,
        allCamNames: [] as AllCamNames,
        bestOfX: {} as BestOfX,
        bingoboard: {} as Bingoboard,
        bingoboardMeta: {} as BingoboardMeta,
        bingoboardMode: {} as BingoboardMode,
        bingosyncSocket: {} as BingosyncSocket,
        countdownTimer: {} as CountdownTimer,
        currentGameLayout: {} as CurrentGameLayout,
        currentInterview: {} as CurrentInterview,
        currentCamNames: {} as CurrentCamNames,
        currentMainBingoboard: {} as CurrentMainBingoboard,
        discordDelayInfo: {} as DiscordDelayInfo,
        discordDelayInfoSunshine: {} as DiscordDelayInfoSunshine,
        donationTotal: 0 as DonationTotal,
        explorationBingoboard: {} as ExplorationBingoboard,
        gameMode: {} as GameMode,
        hostingBingosocket: {} as HostingBingosocket,
        hostsSpeakingDuringIntermission: {} as HostsSpeakingDuringIntermission,
        lastIntermissionTimestamp: 0 as LastIntermissionTimestamp,
        obsAudioSources: {} as ObsAudioSources,
        obsConnection: {} as ObsConnection,
        obsDashboardAudioSources: {} as ObsDashboardAudioSources,
        obsPreviewScene: null as null | string,
        obsCurrentScene: null as null | string,
        obsSceneList: null as null | Scene[],
        obsStreamMode: '' as ObsStreamMode,
        oriBingoboard: {} as OriBingoboard,
        oriBingoMeta: {} as OriBingoMeta,
        showPictureDuringIntermission: {} as ShowPictureDuringIntermission,
        soundOnTwitchStream: 0 as SoundOnTwitchStream,
        trackerData: [] as TrackerData,
        trackerDonations: [] as TrackerDonations,
        trackerOpenBids: [] as TrackerOpenBids,
        trackerPrizes: [] as TrackerPrizes,
        twitchStreams: [] as TwitchStreams,
        voiceActivity: {} as VoiceActivity,
        voiceActivitySunshine: {} as VoiceActivitySunshine,
        songData: {} as SongData,
        // nodecg-speedcontrol
        runDataActiveRun: {} as RunDataActiveRun,
        runDataArray: [] as RunDataArray,
        timer: {} as Timer,
        // timer
        playerAlternate: true,
        //firebase
        gameP1: {} as Games,
        gameP2: {} as Games,
        gameP3: {} as Games,
        gameP4: {} as Games,
    },
    mutations: {
        updateReplicant(state, { name, value }) {
            Vue.set(state, name, value)
        },
        startPlayerAlternateInterval(state, interval) {
            if (playerAlternateInterval) {
                clearInterval(playerAlternateInterval)
            }
            playerAlternateInterval = setInterval(() => {
                Vue.set(state, 'playerAlternate', !state.playerAlternate)
            }, interval)
        },
        stopPlayerAlternateInterval(state) {
            if (playerAlternateInterval) {
                clearInterval(playerAlternateInterval)
            }
            playerAlternateInterval = null
        },
        ...vuexfireMutations,
    },
    actions: {
        bindGameP1: firebaseAction<any, any>(({ bindFirebaseRef }, payload) => {
            // return the promise returned by `bindFirebaseRef` hardcoded for now
            let ref = `games/${payload.gameId || 'floha258'}/items`
            console.log(ref)
            return bindFirebaseRef('gameP1', db.ref(ref))
        }),
        unbindGameP1: firebaseAction<any, any>(({ unbindFirebaseRef }) => {
            unbindFirebaseRef('gameP1')
        }),
        bindGameP2: firebaseAction<any, any>(({ bindFirebaseRef }, payload) => {
            // return the promise returned by `bindFirebaseRef`
            let ref = `games/${payload.gameId || 'lepelog'}/items`
            console.log(ref)
            return bindFirebaseRef('gameP2', db.ref(ref))
        }),
        unbindGameP2: firebaseAction<any, any>(({ unbindFirebaseRef }) => {
            unbindFirebaseRef('gameP2')
        }),
        bindGameP3: firebaseAction<any, any>(({ bindFirebaseRef }, payload) => {
            // return the promise returned by `bindFirebaseRef`
            let ref = `games/${payload.gameId || 'cjs07'}/items`
            console.log(ref)
            return bindFirebaseRef('gameP3', db.ref(ref))
        }),
        unbindGameP3: firebaseAction<any, any>(({ unbindFirebaseRef }) => {
            unbindFirebaseRef('gameP3')
        }),
        bindGameP4: firebaseAction<any, any>(({ bindFirebaseRef }, payload) => {
            // return the promise returned by `bindFirebaseRef`
            let ref = `games/${payload.gameId || 'player4'}/items`
            console.log(ref)
            return bindFirebaseRef('gameP4', db.ref(ref))
        }),
        unbindGameP4: firebaseAction<any, any>(({ unbindFirebaseRef }) => {
            unbindFirebaseRef('gameP4')
        }),
    },
})

store.commit('startPlayerAlternateInterval', 10000)

/**
 * Gets the raw replicant, only intended for modifications, to use values use state
 * @param replicant name of the replicant, throws an error if it isn't found
 */
export function getReplicant<T>(replicant: string): ReplicantBrowser<T> {
    const rep = replicants.get(replicant)
    if (!rep) {
        throw new Error('invalid replicant!')
    }
    return rep
}

replicantNames.forEach((name) => {
    const replicant = nodecg.Replicant(name)

    replicant.on('change', (newVal) => {
        store.commit('updateReplicant', {
            name: replicant.name,
            value: clone(newVal),
        })
    })

    replicants.set(name, replicant)
})

nodecgSpeedcontrolReplicantNames.forEach((name) => {
    const rep = nodecg.Replicant(name, 'nodecg-speedcontrol')

    rep.on('change', (newVal) => {
        store.commit('updateReplicant', {
            name: rep.name,
            value: clone(newVal),
        })
    })

    replicants.set(name, rep)
})

export async function create() {
    return NodeCG.waitForReplicants(...Array.from(replicants.values())).then(() => store)
}
