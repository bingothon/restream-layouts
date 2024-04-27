import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';
import { EventSubHttpListener } from '@twurple/eventsub-http';
import { NgrokAdapter } from '@twurple/eventsub-ngrok';
import { Configschema } from '@/configschema';
import * as nodecgApiContext from './util/nodecg-api-context';
import { sentenceCase } from 'sentence-case';

let isRunningQueue = false;
const eventsQueue: unknown[] = [];
let waitForNext = false;
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
    adapter: new NgrokAdapter({ ngrokConfig: { authtoken: '2fggm41yy1APQKDsYHjdaUTKssP_63d6thJf7DcztvaBWXauE' } }),
    secret: config.twitchEventSub?.eventSubListenerKey || ''
});

const getChannelEventSubscriptions = (obj: object): string[] => {
    const properties = new Set<string>();
    let currentObj = obj;
    do {
        Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
    } while ((currentObj = Object.getPrototypeOf(currentObj)));
    return [...properties.keys()].filter((item) => item.includes('subscribeToChannel'));
};

const delay = (milliseconds: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });

const queueSendHandler = async (waitForNext: boolean) => {
    // eventsQueue[0].data has EventSubHandler object attached with it's own properties.
    // You'd actaully want to forward all as in `data: eventsQueue[0].data`
    // then in the vue file, use the property that is suitable for information you'd need.
    // see, twurple documentation on EventSubHandler for properties specific to eventsubscription types.

    //console.log("Checking for new Subs and Follows")
    if (!waitForNext) {
        while (eventsQueue.length > 0) {
            isRunningQueue = true;
            await delay(10000);
            //nodecg.sendMessage(`${eventsQueue[0].type}`, { username: eventsQueue[0].data.userDisplayName });
            await delay(10000);
            eventsQueue.shift();
        }
        isRunningQueue = false;
    }
};

const newEventCheck = async () => {
    waitForNext = isRunningQueue;
    await queueSendHandler(waitForNext);
};

const main = async () => {
    const eventSubscriptions = getChannelEventSubscriptions(listener);
    for (const eventSubscription of eventSubscriptions) {
        try {
            const parsedEventType = sentenceCase(eventSubscription.slice(11, eventSubscription.length)).replace(/ /g, '_').toUpperCase();
            if (parsedEventType === 'CHANNEL_FOLLOW_EVENTS') {
                console.log(`Attempting to subscribe to ${parsedEventType}`);
                listener[eventSubscription as 'onChannelFollow'](userId, userId, (event) => {
                    console.log(`what is here`, typeof event);
                    eventsQueue.push({
                        type: parsedEventType,
                        data: event
                    });
                });
            }
            if (parsedEventType === 'CHANNEL_SUBSCRIBTION_EVENTS') {
                console.log(`Attempting to subscribe to ${parsedEventType}`);
                listener[eventSubscription as 'onChannelSubscription'](userId, (event) => {
                    console.log(`what is here`, typeof event);
                    eventsQueue.push({
                        type: parsedEventType,
                        data: event
                    });
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
    listener.start();

    const channelSubscriptionEvent = listener.onChannelSubscription(userId, (event) => eventHandler(event, 'sub'));
    const subGift = listener.onChannelSubscriptionGift(userId, (event) => eventHandler(event, 'giftSub'));
    const channelFollowEvent = listener.onChannelFollow(userId, userId, (event) => eventHandler(event, 'follow'));
    const resubEvent = listener.onChannelSubscriptionMessage(userId, (event) => eventHandler(event, 'resub'));
    logger.info('sub', await channelSubscriptionEvent.getCliTestCommand());
    logger.info('follow', await channelFollowEvent.getCliTestCommand());
    logger.info('gift sub', await subGift.getCliTestCommand());
    logger.info('resub', await resubEvent.getCliTestCommand());
    setInterval(newEventCheck, 1000);
};

main();

function eventHandler(event: unknown, type: 'resub' | 'sub' | 'giftSub' | 'follow') {
    eventsQueue.push(event);
    while (eventsQueue.length > 0) {
        if ((new Date().getTime()) - lastTimestamp <= ANIMATION_DELAY) {
            continue;
        }
        lastTimestamp = new Date().getTime();
        const event = eventsQueue.shift();
        nodecg.sendMessage(type, event)
        return;
    }
}
