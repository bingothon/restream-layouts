import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';
import { EventSubHttpListener } from '@twurple/eventsub-http';
import { NgrokAdapter } from '@twurple/eventsub-ngrok';
import { Configschema } from '@/configschema';
import * as nodecgApiContext from './util/nodecg-api-context';
import {
    EventSubChannelFollowEvent,
    EventSubChannelSubscriptionEvent, EventSubChannelSubscriptionGiftEvent,
    EventSubChannelSubscriptionMessageEvent
} from '@twurple/eventsub-base';

type knownEvents = EventSubChannelSubscriptionEvent | EventSubChannelFollowEvent | EventSubChannelSubscriptionMessageEvent | EventSubChannelSubscriptionGiftEvent;
type eventEnum = 'resub' | 'sub' | 'giftSub' | 'follow'

const eventsQueue: {type: eventEnum, event: knownEvents}[] = [];
let lastTimestamp = 0;
// Delay to wait for the animation to play
const ANIMATION_DELAY = 10000;

// bingothon const userId = '539920154';
const userId = '53717309'; //Floha258
const nodecg = nodecgApiContext.get();
const config = nodecg.bundleConfig as Configschema;

const clientId = config.twitchEventSub?.clientID || '';
const clientSecret = config.twitchEventSub?.clientSecret || '';

const authProvider = new RefreshingAuthProvider({ clientId, clientSecret });
const client = new ApiClient({ authProvider });

const logger = new (nodecgApiContext.get().Logger)('eventSub');

// Make sure to register an application with twitch redirect does not matter
// Then makes sure to go throught the proper auth process by following https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#authorization-code-grant-flow
authProvider.addUser(
    userId,
    {
        accessToken: config.twitchEventSub?.accessToken.token || '',
        refreshToken: config.twitchEventSub?.accessToken.refreshToken || '',
        expiresIn: config.twitchEventSub?.accessToken.expiresIn || 0,
        scope: config.twitchEventSub?.accessToken.scopes || [],
        obtainmentTimestamp: config.twitchEventSub?.accessToken.obtained || 0
    },
    ['moderator:read:followers', 'channel:read:subscriptions']
);

logger.info('user in?', authProvider.hasUser(userId), 'scopes', authProvider.getCurrentScopesForUser(userId));

const listener = new EventSubHttpListener({
    apiClient: client,
    /*adapter: new ReverseProxyAdapter({
        hostName: config.twitchEventSub.hostName, // The host name the server is available from
        port: 443 // The external port (optional, defaults to 443)
    }),*/
    adapter: new NgrokAdapter({ ngrokConfig: { authtoken: '' } }),
    secret: config.twitchEventSub?.eventSubListenerKey || ''
});

listener.removeListener()

async function main(): Promise<void> {
    await client.eventSub.deleteAllSubscriptions();
    listener.start();

    const channelSubscriptionEvent = listener.onChannelSubscription(userId, (event) => eventHandler(event, 'sub'));
    //const subGift = listener.onChannelSubscriptionGift(userId, (event) => eventHandler(event, 'giftSub'));
    const channelFollowEvent = listener.onChannelFollow(userId, userId, (event) => eventHandler(event, 'follow'));
    const resubEvent = listener.onChannelSubscriptionMessage(userId, (event) => eventHandler(event, 'resub'));
    logger.info('sub', await channelSubscriptionEvent.getCliTestCommand());
    logger.info('follow', await channelFollowEvent.getCliTestCommand());
    //logger.info('gift sub', await subGift.getCliTestCommand());
    logger.info('resub', await resubEvent.getCliTestCommand());
}

main();

function eventHandler(event: knownEvents, type: eventEnum) {
    eventsQueue.push({type, event});
    logger .info('Received Event', type)
    while (eventsQueue.length > 0) {
        logger.info('in Loop');
        if (new Date().getTime() - lastTimestamp <= ANIMATION_DELAY) {
            logger.info('current Date', new Date().getTime(), 'last Timestamp', lastTimestamp, 'delay', ANIMATION_DELAY);
            continue;
        }
        lastTimestamp = new Date().getTime();
        const eventQueueObject = eventsQueue.shift();
        const messagePayloadUserName : string = (eventQueueObject?.event as Exclude<knownEvents, EventSubChannelSubscriptionGiftEvent>).userDisplayName || (eventQueueObject?.event as EventSubChannelSubscriptionGiftEvent).gifterDisplayName || '';
        nodecg.sendMessage(eventQueueObject!.type, messagePayloadUserName);
        return;
    }
}
