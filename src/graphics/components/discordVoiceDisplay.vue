<template>
    <div
        class="DiscordVoiceDisplay FlexContainer"
        :style="{'--icon-height':iconHeight, '--name-width':nameWidth}"
    >
        <div
            class="Member FlexContainer"
            v-for="member in voiceActivityMembers"
            :class="{'Active':member.isSpeaking}"
            :key="member.id"
        >
            <div class="AvatarContainer">
                <img :src="member.avatar">
                <div class="MicIcon FlexContainer">
                    <font-awesome-icon :icon="micIcon" :style="{ color: 'white' }" />
                </div>
            </div>
            <div class="Name">
                <text-fit :text="member.name">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

import { store } from '../../browser-util/state';
import TextFit from "../helpers/text-fit.vue";
import { VoiceActivityMember } from '../../../types';

@Component({
    components: {
        FontAwesomeIcon,
        TextFit,
    }
})
export default class DiscordVoiceDisplay extends Vue {
    @Prop({default: "40px"})
    iconHeight: string;
    @Prop({default: "100px"})
    nameWidth: string;

    get voiceActivityMembers(): VoiceActivityMember[] {
        return store.state.voiceActivity.members;
    }

    get micIcon() {
        return faMicrophone;
    }
}
</script>

<style>
    .DiscordVoiceDisplay {
        justify-content: flex-start;
        align-content: start;
        flex-wrap: wrap;
    }

    .DiscordVoiceDisplay > .Member {
        margin: 5px 0 0 5px;
    }

    .DiscordVoiceDisplay > .Member > .AvatarContainer {
        position: relative;
    }

    .DiscordVoiceDisplay > .Member > .AvatarContainer > img {
        width: var(--icon-height);
        height: var(--icon-height);
        border-radius: 100%;
    }

    .DiscordVoiceDisplay > .Member > .AvatarContainer > .MicIcon {
        position: absolute;
        width: 25px;
        height: 25px;
        top: -4px;
        right: -4px;
        background-color: blue;
        border-radius: 100%;

        opacity: 0;
    }

    .DiscordVoiceDisplay > .Member.Active > .AvatarContainer > .MicIcon {
        opacity: 1;
    }

    .DiscordVoiceDisplay > .Member > div.Name {
        font-size: 22px;
        margin-left: 8px;
        margin-right: 8px;
        color: white;
        width: var(--name-width);
        position: relative;
    }

    .DiscordVoiceDisplay > .Member.Active > div.Name {
        text-shadow: 0px 0px 15px  #0384da;
    }
</style>