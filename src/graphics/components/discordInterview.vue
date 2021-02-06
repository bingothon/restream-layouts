<template>
    <div
        :style="{'--icon-height':iconHeight, '--name-width':nameWidth, '--voice-highlight-color': voiceHighlightColor}"
        class="DiscordVoiceDisplay FlexContainer"
    >
        <div
            v-for="member in voiceActivityMembers"
            :key="member.id"
            :class="{'Active':member.isSpeaking}"
            class="Member FlexContainer"
        >
            <div class="AvatarContainer">
                <img :src="member.avatar">
                <div class="MicIcon FlexContainer">
                    <font-awesome-icon :icon="micIcon" :style="{ color: 'white'}"/>
                </div>
            </div>
            <div class="NameContainer"></div>
            <div class="Name">
                <text-fit-discord :text="member.name" :align="'center'"></text-fit-discord>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faMicrophone} from "@fortawesome/free-solid-svg-icons";

import {store} from '../../browser-util/state';
import TextFitDiscord from "../helpers/text-fit-discord.vue";
import {VoiceActivityMember} from '../../../types';

@Component({
    components: {
        FontAwesomeIcon,
        TextFitDiscord,
    }
})
export default class DiscordInterview extends Vue {
    @Prop({default: "40px"})
    iconHeight: string;
    @Prop({default: "100px"})
    nameWidth: string;
    @Prop({default: "blue"})
    voiceHighlightColor: string;
    @Prop({default: 4})
    maxUserCount: number;

    get voiceActivityMembers(): VoiceActivityMember[] {
        const members = store.state.gameMode.game === "sms" ? store.state.voiceActivitySunshine.members : store.state.voiceActivity.members;
        if (members.length > this.maxUserCount) {
            return members.slice(0, this.maxUserCount);
        }
        return members;
    }

    get micIcon() {
        return faMicrophone;
    }
}
</script>

<style>
.DiscordVoiceDisplay {
    justify-content: center;
    align-content: center;
    text-align: center;
    flex-wrap: wrap;
}

.DiscordVoiceDisplay > .Member {
    margin: 5px 0 0 5px;
}

.DiscordVoiceDisplay > .Member > .AvatarContainer {
    position: relative;
    margin: 97px;
}

.DiscordVoiceDisplay > .Member > .AvatarContainer > img {
    width: var(--icon-height);
    height: var(--icon-height);
    border-radius: 100%;
}

.DiscordVoiceDisplay > .Member > .AvatarContainer > .MicIcon {
    position: absolute;
    width: 50px;
    height: 50px;
    top: -4px;
    right: -4px;
    background: linear-gradient(var(--lighter-main-color-bingothon), var(--darker-main-color-bingothon));
    border-radius: 100%;

    opacity: 0;
}

.DiscordVoiceDisplay > .Member.Active > .AvatarContainer > .MicIcon {
    opacity: 1;
    font-size: 35px;
}

.DiscordVoiceDisplay > .Member > div.NameContainer {
    font-size: 40px;
    margin-top: 250px;
    margin-left: 8px;
    color: white;
    width: calc(var(--name-width) + 50px);
    position: absolute;
    height: 75px;
}

.DiscordVoiceDisplay > .Member.Active > div.NameContainer {
    background: linear-gradient(var(--lighter-main-color-bingothon), var(--darker-main-color-bingothon));
    transform: skew(20deg)
}

.DiscordVoiceDisplay > .Member > div.Name {
    font-size: 40px;
    margin-top: 250px;
    margin-left: 8px;
    margin-right: 8px;
    color: white;
    width: var(--name-width);
    position: absolute;
    height: 75px;
    justify-content: center;
    align-content: center;
    text-align: center;
}

.DiscordVoiceDisplay > .Member > div.Name > div#TextContainerDiscord {
    justify-content: center;
    align-content: center;
    text-align: center;
    flex-wrap: wrap;
    align-self: center;
    margin: auto;
    display: flex;
}

.DiscordVoiceDisplay > .Member > div.Name > div#TextContainerDiscord > div#FittedTextContentDiscord {
    max-width: 250px;
    align-items: center;
    justify-content: center;
}

/*#Fit {
    justify-content: center;
    align-content: center;
    text-align: center;
    width: var(--name-width);
}*/
</style>
