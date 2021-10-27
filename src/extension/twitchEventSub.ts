import {ApiClient} from "twitch";
import {ClientCredentialsAuthProvider, StaticAuthProvider} from 'twitch-auth';
import {DirectConnectionAdapter, EventSubListener, ReverseProxyAdapter} from 'twitch-eventsub';
import {Configschema} from "../../configschema";
import * as nodecgApiContext from "./util/nodecg-api-context";
import { sentenceCase } from "sentence-case";

let isRunningQueue: boolean = false
let eventsQueue: {type: string, data: any}[] = []
let waitForNext: boolean = false

const userId = '539920154';
const nodecg = nodecgApiContext.get();
const config = nodecg.bundleConfig as Configschema;

// @ts-ignore
const clientId = config.twitchEventSub.clientID;
// @ts-ignore
const accessToken = config.twitchEventSub.accessToken;
// @ts-ignore
const clientSecret = config.twitchEventSub.clientSecret;

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
    const client = new ApiClient({authProvider});

    const listener = new EventSubListener(client, new ReverseProxyAdapter({
        // @ts-ignore
        hostName: config.twitchEventSub.hostName, // The host name the server is available from
        externalPort: 443 // The external port (optional, defaults to 443)
        // @ts-ignore
    }), config.twitchEventSub.eventSubListenerKey);

const getChannelEventSubscriptions = (obj: object) => {
    let properties = new Set()
    let currentObj = obj
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(item => (item as string).includes('subscribeToChannel'))
}

const delay = (milliseconds: Number) => new Promise(resolve => { setTimeout(resolve, Number(milliseconds)) })

const queueSendHandler = async (waitForNext: boolean) => {
    //console.log("Checking for new Subs and Follows")
    if(!waitForNext){
        while(eventsQueue.length > 0){
            isRunningQueue = true;
            nodecg.sendMessage(`${eventsQueue[0].type}`, {username: eventsQueue[0].data.userDisplayName})
            await delay(1000)
            eventsQueue.shift()
        }
        isRunningQueue = false;
    }
}

const newEventCheck = async() => {  
    if(isRunningQueue){
        waitForNext = true
    }else{
        waitForNext = false;
    }
    await queueSendHandler(waitForNext)
} 

const main = async () => {
	const eventSubscriptions = getChannelEventSubscriptions(listener)
	for(let eventSubscription of eventSubscriptions){
		try {
            
            // @ts-ignore
            let parsedEventType = sentenceCase(eventSubscription.slice(11, eventSubscription.length))
                                  .replace(/ /g, "_").toUpperCase()
            if(parsedEventType === 'CHANNEL_FOLLOW_EVENTS' || parsedEventType === 'CHANNEL_SUBSCRIBTION_EVENTS'){
                // @ts-ignore
                console.log(`Attempting to subscribe to ${parsedEventType}`)
                // @ts-ignore
                await listener[eventSubscription](userId, e => {
                    console.log(`what is here`, typeof e)
                    eventsQueue.push({
                        // @ts-ignore
                        type: parsedEventType,
                        // @ts-ignore 
                        data: e
                    })
                });
			}
		}catch(err){
			console.log(err)
		}
	}
	await listener.listen();
    setInterval(newEventCheck, 1000)
}

main()
