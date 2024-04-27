import { ApiClient } from "@twurple/api";
import { AppTokenAuthProvider, RefreshingAuthProvider } from '@twurple/auth';
import {
    EventSubHttpListener,
    // ReverseProxyAdapter
} from '@twurple/eventsub-http';
import { NgrokAdapter} from '@twurple/eventsub-ngrok';
import {Configschema} from '@/configschema';
import * as nodecgApiContext from "./util/nodecg-api-context";
import { sentenceCase } from "sentence-case";
import { EventSubChannelFollowEvent, EventSubChannelSubscriptionEvent } from '@twurple/eventsub-base';

let isRunningQueue = false
const eventsQueue: { type: string; data: EventSubChannelFollowEvent | EventSubChannelSubscriptionEvent }[] = [];
let waitForNext = false

// bingothon const userId = '539920154';
const userId = '53717309' //Floha258
const nodecg = nodecgApiContext.get();
const config = nodecg.bundleConfig as Configschema;

const clientId = config.twitchEventSub.clientID;
const clientSecret = config.twitchEventSub.clientSecret;

const authProvider = new AppTokenAuthProvider(clientId, clientSecret, ['moderator:read:followers', 'channel:read:subscriptions']);
const client = new ApiClient({authProvider});

const logger = new (nodecgApiContext.get()).Logger('eventSub')

logger.info('Auth Provider Scopes', authProvider.currentScopes);

const listener = new EventSubHttpListener({
    apiClient: client,
    /*adapter: new ReverseProxyAdapter({
        hostName: config.twitchEventSub.hostName, // The host name the server is available from
        port: 443 // The external port (optional, defaults to 443)
    }),*/
    adapter: new NgrokAdapter({ngrokConfig: { authtoken: '' }}),
    secret: config.twitchEventSub.eventSubListenerKey
});

const getChannelEventSubscriptions = (obj: object) : string[] => {
    const properties = new Set<string>()
    let currentObj = obj
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(item => item.includes('subscribeToChannel'))
}

const delay = (milliseconds: number) => new Promise(resolve => { setTimeout(resolve, milliseconds) })

const queueSendHandler = async (waitForNext: boolean) => {

    // eventsQueue[0].data has EventSubHandler object attached with it's own properties.
    // You'd actaully want to forward all as in `data: eventsQueue[0].data`
    // then in the vue file, use the property that is suitable for information you'd need.
    // see, twurple documentation on EventSubHandler for properties specific to eventsubscription types.

    //console.log("Checking for new Subs and Follows")
    if(!waitForNext){
        while(eventsQueue.length > 0){
            isRunningQueue = true;
            await delay(10000)
            nodecg.sendMessage(`${eventsQueue[0].type}`, {username: eventsQueue[0].data.userDisplayName})
            await delay(10000)
            eventsQueue.shift()
        }
        isRunningQueue = false;
    }
}

const newEventCheck = async() => {
    waitForNext = isRunningQueue;
    await queueSendHandler(waitForNext)
}

const main = async () => {
    const eventSubscriptions = getChannelEventSubscriptions(listener)
    for(const eventSubscription of eventSubscriptions){
        try {
            const parsedEventType = sentenceCase(eventSubscription.slice(11, eventSubscription.length))
                .replace(/ /g, "_").toUpperCase()
            if(parsedEventType === 'CHANNEL_FOLLOW_EVENTS'){
                console.log(`Attempting to subscribe to ${parsedEventType}`)
                listener[(eventSubscription as 'onChannelFollow')](userId, userId, (event) => {
                    console.log(`what is here`, typeof event)
                    eventsQueue.push({
                        type: parsedEventType,
                        data: event
                    })
                });
            }
            if(parsedEventType === 'CHANNEL_SUBSCRIBTION_EVENTS') {
                console.log(`Attempting to subscribe to ${parsedEventType}`)
                listener[(eventSubscription as 'onChannelSubscription')](userId, (event) => {
                    console.log(`what is here`, typeof event)
                    eventsQueue.push({
                        type: parsedEventType,
                        data: event
                    })
                });
            }
        }catch(err){
            console.log(err)
        }
    }
    listener.start();
    
    const channelSubscriptionEvent = listener.onChannelSubscription(userId, event => console.log(`sub by ${event.userDisplayName}`));
    const channelFollowEvent = listener.onChannelFollow(userId, userId,event => console.log(`follow by ${event.userDisplayName}`));
    logger.info('sub', await channelSubscriptionEvent.getCliTestCommand())
    logger.info('follow', await channelFollowEvent.getCliTestCommand())
    setInterval(newEventCheck, 1000)
}

main()
