<template>
    <div>
        <span v-if="hostsSpeakingDuringIntermission">Hosts are currently speaking!</span>
        <span>Last intermission: {{ timeSinceLastIntermission }}</span>
        <div v-if="obsConnectionStatus == 'disconnected'">Currently disconnected :(</div>
        <div v-if="obsConnectionStatus == 'error'">OBS connection error monkaS</div>
        <div v-if="obsConnectionStatus == 'disabled'">OBS is disabled, nothing to see here</div>
        <div v-if="obsConnectionStatus == 'connected'">
            Current Scene: {{ currentScene }}
            <select v-model="previewScene">
                <option v-for="(scene, i) in sceneNameList" :key="i" :value="scene">
                    {{ scene }}
                </option>
            </select>
            <div>
                Audio Preset:
                <select v-model="obsStreamMode">
                    <option v-for="(mode, i) in obsStreamModes" :key="i" :value="mode">
                        {{ mode }}
                    </option>
                </select>
            </div>
            <div v-for="(audio, i) in obsAudioSources" :key="i">
                {{ audio[0] }}:
                <input
                    :value="audio[1].baseVolume * 100"
                    type="range"
                    @change="updateAudioSourceBaseVolume(audio[0], $event)"
                />
                <button :disabled="!canTriggerAudioFade(audio[1].fading)" @click="toggleAudioFade(audio[0])">
                    {{ toggleAudioFadeText(audio[1].fading) }}
                </button>
            </div>
            <div>
                <div>
                    <input v-model="discordAudioDelaySync" type="checkbox" /> Sync discord audio with stream leader
                    delay
                </div>
                <div v-if="!discordAudioDelaySync">
                    Discord audio delay (in ms): <input v-model="discordAudioDelay" type="number" />
                </div>
                <div>
                    <input v-model="discordDisplayDelaySync" type="checkbox" /> Sync discord display with stream leader
                    delay
                </div>
                <div v-if="!discordDisplayDelaySync">
                    Discord display delay (in ms): <input v-model="discordDisplayDelay" type="number" />
                </div>
            </div>
            <button @click="doTransition">Transition now</button>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { nodecg } from '../../browser-util/nodecg';
    import { ObsDashboardAudioSources, DiscordDelayInfo, ObsStreamMode } from '../../../schemas';
    import { store, getReplicant } from '../../browser-util/state';

    const bundleName = 'restream-layouts';

    @Component({})
    export default class OBSControl extends Vue {
        timeSinceLastIntermission: string = '';
        lastIntermissionInterval: NodeJS.Timeout | null = null;

        mounted() {
            this.lastIntermissionInterval = setInterval(() => {
                const totalS = new Date().getTime() / 1000 - store.state.lastIntermissionTimestamp;
                const mins = (totalS / 60).toFixed(0);
                const secs = (totalS % 60).toFixed(0);
                this.timeSinceLastIntermission = mins + ':' + secs.padStart(2, '0');
            }, 1000);
        }

        destroyed() {
            if (this.lastIntermissionInterval) {
                clearInterval(this.lastIntermissionInterval);
                this.lastIntermissionInterval = null;
            }
        }

        get obsStreamModes(): ObsStreamMode[] {
            return ['external-commentary', 'runner-commentary', 'racer-audio-only'];
        }

        get hostsSpeakingDuringIntermission(): boolean {
            return store.state.hostsSpeakingDuringIntermission.speaking;
        }

        get obsConnectionStatus(): string {
            return store.state.obsConnection.status;
        }

        get currentScene(): string {
            return store.state.obsCurrentScene;
        }

        get previewScene(): string {
            return store.state.obsPreviewScene;
        }

        set previewScene(scene: string) {
            getReplicant('obsPreviewScene').value = scene;
        }

        get obsAudioSources(): [string, any][] {
            return Object.entries(store.state.obsDashboardAudioSources);
        }

        updateAudioSourceBaseVolume(audioSource: string, $event: any) {
            getReplicant<ObsDashboardAudioSources>('obsDashboardAudioSources').value[audioSource].baseVolume =
                parseInt($event.target.value, 10) / 100;
        }

        get sceneNameList(): string[] {
            return store.state.obsSceneList.map((s) => s.name);
        }

        get discordAudioDelay(): string {
            return `${store.state.discordDelayInfo.discordAudioDelayMs}`;
        }

        set discordAudioDelay(delay: string) {
            getReplicant<DiscordDelayInfo>('discordDelayInfo').value.discordAudioDelayMs = parseInt(delay, 10);
        }

        get discordAudioDelaySync(): boolean {
            return store.state.discordDelayInfo.discordAudioDelaySyncStreamLeader;
        }

        set discordAudioDelaySync(sync: boolean) {
            getReplicant<DiscordDelayInfo>('discordDelayInfo').value.discordAudioDelaySyncStreamLeader = sync;
        }

        get discordDisplayDelay(): string {
            return `${store.state.discordDelayInfo.discordDisplayDelayMs}`;
        }

        set discordDisplayDelay(delay: string) {
            getReplicant<DiscordDelayInfo>('discordDelayInfo').value.discordDisplayDelayMs = parseInt(delay, 10);
        }

        get discordDisplayDelaySync(): boolean {
            return store.state.discordDelayInfo.discordDisplayDelaySyncStreamLeader;
        }

        set discordDisplayDelaySync(sync: boolean) {
            getReplicant<DiscordDelayInfo>('discordDelayInfo').value.discordDisplayDelaySyncStreamLeader = sync;
        }

        get obsStreamMode(): ObsStreamMode {
            return store.state.obsStreamMode;
        }

        set obsStreamMode(mode: ObsStreamMode) {
            getReplicant<ObsStreamMode>('obsStreamMode').value = mode;
        }

        doTransition() {
            nodecg.sendMessageToBundle('obs:transition', bundleName);
        }

        toggleAudioFade(source: string) {
            if (store.state.obsDashboardAudioSources[source].fading === 'muted') {
                nodecg.sendMessageToBundle('obsRemotecontrol:fadeInAudio', bundleName, { source });
            } else {
                nodecg.sendMessageToBundle('obsRemotecontrol:fadeOutAudio', bundleName, { source });
            }
        }

        toggleAudioFadeText(fade: string): string {
            switch (fade) {
                case 'fadein':
                    return 'Fading in...';
                case 'fadeout':
                    return 'Fading out...';
                case 'muted':
                    return 'Unmute';
                case 'unmuted':
                    return 'Mute';
                default:
                    return 'unreachable';
            }
        }

        canTriggerAudioFade(fade: string): boolean {
            return ['muted', 'unmuted'].includes(fade);
        }
    }
</script>

<style>
    .error-warning {
        color: red;
        font-size: small;
    }
</style>
