<template>
    <div class="SubTop">
        <div id="SubNotifs">
            <img id="emote" src="../../../static/emote-ayaya.png" />
            <img id="bubble" src="../../../static/speechbubble.png" />
            <div id="subText">{{ message }}</div>
            <div id="subName">
                <text-fit id="text" :text="`${username}`" align="center"></text-fit>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import TextFit from '../helpers/text-fit.vue';
    import { nodecg } from '../../browser-util/nodecg';
    import {
        EventSubChannelFollowEvent,
        EventSubChannelSubscriptionEvent,
        EventSubChannelSubscriptionGiftEvent,
        EventSubChannelSubscriptionMessageEvent
    } from '@twurple/eventsub-base';

    @Component({
        components: {
            TextFit
        }
    })
    export default class SubNotifs extends Vue {
        username: string = 'LongerName';
        message: string = 'Thank you<br />for subscribing';

        messages: {
            sub: 'Thank you<br/>for subscribing';
            follow: 'Thank you<br/>for following';
            resub: 'Thank you<br/>for resubscribing for 000 months';
            gitSub: 'Thank you<br/>for gifting a sub';
        };

        runNotification = async () => {
            const $subBox = document.getElementById('SubNotifs');
            const $subBoxFrames = [
                {
                    transform: 'none'
                },
                {
                    transform: 'translateY(-100px) scale(1)',
                    offset: 0.6
                },
                {
                    transform: 'translateY(-200px)',
                    offset: 0.99
                },
                {
                    transform: 'translateY(0px)'
                }
            ];
            $subBox.animate($subBoxFrames, {
                duration: 10000,
                fill: 'forwards',
                easing: 'cubic-bezier(.6, 1, 0, .9)',
                iterations: 1
            });
        };

        mounted() {
            nodecg.listenFor('sub', (data: EventSubChannelSubscriptionEvent) => {
                this.username = data.userDisplayName;
                this.message = this.messages.sub;
                this.runNotification();
            });

            nodecg.listenFor('resub', (data: EventSubChannelSubscriptionMessageEvent) => {
                this.username = data.userDisplayName;
                this.message = this.messages.resub;
                this.runNotification();
            });

            nodecg.listenFor('giftSub', (data: EventSubChannelSubscriptionGiftEvent) => {
                this.username = data.gifterDisplayName;
                this.message = this.messages.sub;
                this.runNotification();
            });

            nodecg.listenFor('follow', (data: EventSubChannelFollowEvent) => {
                this.username = data.userDisplayName;
                this.message = this.messages.follow;
                this.runNotification();
            });
        }
    }
</script>

<style scoped>
    #SubNotifs {
        position: relative;
        top: 200px;
    }

    #emote {
        height: 100px;
    }

    #bubble {
        width: 300px;
        height: 194px;
    }

    #subText {
        position: absolute;
        text-align: center;
        top: 20px;
        font-size: 20px;
        left: 180px;
        color: white;
    }

    #subName {
        position: absolute;
        text-align: center;
        top: 90px;
        left: 125px;
        width: 260px;
        color: white;
        font-weight: bold;
        font-size: 30px;
    }

    #text {
        position: relative;
    }
</style>
