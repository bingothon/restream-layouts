import {ApiClient} from "twitch";
import {ClientCredentialsAuthProvider, StaticAuthProvider} from 'twitch-auth';
import {DirectConnectionAdapter, EventSubListener, ReverseProxyAdapter} from 'twitch-eventsub';
import {Configschema} from "../../configschema";
import * as nodecgApiContext from "./util/nodecg-api-context";

let isRunningQueue = false
let subscriptionAndFollowQueue: any = []
let waitForNext: any = false

const delay = (milliseconds: Number) => new Promise(resolve => { setTimeout(resolve, Number(milliseconds)) })

const nodecg = nodecgApiContext.get();
const config = nodecg.bundleConfig as Configschema;
// @ts-ignore
const clientId = config.twitchEventSub.clientID;
// @ts-ignore
const accessToken = config.twitchEventSub.accessToken;
// @ts-ignore
const clientSecret = config.twitchEventSub.clientSecret;

const queueSendHandler = async (waitForNext: any) => {
    //console.log("Checking for new Subs and Follows")
    if(!waitForNext){
        while(subscriptionAndFollowQueue.length > 0){
            isRunningQueue = true;
            nodecg.sendMessage("newSub", {username: subscriptionAndFollowQueue[0]})
            console.log(subscriptionAndFollowQueue[0])
            await delay(1000)
            subscriptionAndFollowQueue.shift()
        }
        isRunningQueue = false;
    }
}

const newFollowerAndSubscriberCheck = async() => {  
    if(isRunningQueue){
        waitForNext = true
    }else{
        waitForNext = false;
    }
    await queueSendHandler(waitForNext)
}

const sendMessagesToScreen = setInterval(newFollowerAndSubscriberCheck, 1000)

const main = async () => {
    const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
    const client = new ApiClient({authProvider});

    const listener = new EventSubListener(client, new ReverseProxyAdapter({
        // @ts-ignore
        hostName: config.twitchEventSub.hostName, // The host name the server is available from
        externalPort: 443 // The external port (optional, defaults to 443)
        // @ts-ignore
    }), config.twitchEventSub.eventSubListenerKey);

    const userId = '539920154';

    const onlineSubscription = await listener.subscribeToStreamOnlineEvents(userId, e => {
        console.log(`${e.broadcasterDisplayName} just went live!`);
    });

    const offlineSubscription = await listener.subscribeToStreamOfflineEvents(userId, e => {
        console.log(`${e.broadcasterDisplayName} just went offline`);
    });

    const followSubscription = await listener.subscribeToChannelFollowEvents(userId, e => {
        console.log(e)
        console.log(`${e.userDisplayName} just followed`);
        subscriptionAndFollowQueue.push(e.userDisplayName)
    });

    const subscribeSubscription = await listener.subscribeToChannelSubscriptionEvents(userId, e => {
        console.log(e)
        console.log(`${e.userDisplayName} just subscribed`);
        subscriptionAndFollowQueue.push(e.userDisplayName)
    });

    // await subscribeSubscription.stop()
    // await onlineSubscription.stop()
    // await offlineSubscription.stop()
    // await followSubscription.start()
    sendMessagesToScreen
    await listener.listen();
}

main()
