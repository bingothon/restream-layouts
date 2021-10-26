import {ApiClient} from "twitch";
import {ClientCredentialsAuthProvider, StaticAuthProvider} from 'twitch-auth';
import {DirectConnectionAdapter, EventSubListener, ReverseProxyAdapter} from 'twitch-eventsub';
import {Configschema} from "../../configschema";
import * as nodecgApiContext from "./util/nodecg-api-context";

const nodecg = nodecgApiContext.get();
const config = nodecg.bundleConfig as Configschema;
// @ts-ignore
const clientId = config.twitchPubSub.clientID;
// @ts-ignore
const accessToken = config.twitchPubSub.accessToken;
// @ts-ignore
const clientSecret = config.twitchPubSub.clientSecret;

const main = async () => {
    const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
    const client = new ApiClient({authProvider});

    const listener = new EventSubListener(client, new ReverseProxyAdapter({
        // @ts-ignore
        hostName: config.twitchPubSub.hostName, // The host name the server is available from
        externalPort: 443 // The external port (optional, defaults to 443)
        // @ts-ignore
    }), config.twitchPubSub.eventSubListenerKey);

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
    });

    const subscribeSubscription = await listener.subscribeToChannelSubscriptionEvents(userId, e => {
        console.log(e)
        console.log(`${e.userDisplayName} just subscribed`);
        nodecg.sendMessage("newSub", {username: e.userDisplayName})
    });

    // await subscribeSubscription.stop()
    // await onlineSubscription.stop()
    // await offlineSubscription.stop()
    // await followSubscription.start()
    await listener.listen();
}

main()
