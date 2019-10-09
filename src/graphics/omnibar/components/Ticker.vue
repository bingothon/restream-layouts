<template>
  <div
    id="Ticker"
  >
    <transition
      name="fade"
      mode="out-in"
    >
      <component
        :is="currentComponent.name"
        :key="timestamp"
        :data="currentComponent.data"
        @end="showNextMsg"
      ></component>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { store } from "../../../browser-util/state";
import { TrackerDonations, TrackerOpenBids } from "../../../../schemas";
import { TrackerDonation, TrackerOpenBid } from "../../../../types";
import GenericMessage from './ticker/GenericMessage.vue';
//import UpcomingRun from './ticker/UpcomingRun.vue';
import Prize from './ticker/Prize.vue';
import Bid from './ticker/Bid.vue';
import Alert from './ticker/Alert.vue';
const newDonations: TrackerDonations = [];

interface TickerMessage {
    name: string,
    data: any,
}

@Component({
    components: {
        GenericMessage,
        //UpcomingRun,
        Prize,
        Bid,
        Alert,
    }
})
export default class Ticker extends Vue {
    timestamp = Date.now();
    staticMessages: TickerMessage[];
    currentComponent: TickerMessage = {name: '', data:{}};
    currentState: number = 0;

    mounted() {
        this.staticMessages = [
            this.genericMessage('This is Bingothon Winter 2019, enjoy your stay!'),
            this.genericMessage('#BingothonW2019 benefits Pure Earth!'),
            this.genericMessage('Donate @ TODO'),
        ];
        this.showNextMsg();
    }

    genericMessage(msg: string): TickerMessage {
        return {
            name: GenericMessage.name,
            data: {
                msg
            }
        };
    }

    showNextMsg() {
        console.log("nextMsg");
        let currentComponent: TickerMessage;
        // give new donations priority
        if (newDonations.length) {
            currentComponent = this.donation(newDonations.shift());
        } else {
            switch (this.currentState) {
                // temp solution until they are all implemented
                //case 0: currentComponent = this.upcomingRun(); break;
                case 1: currentComponent = this.prize(); break;
                case 2: currentComponent = this.bid(); break;
                default: currentComponent = this.staticMessages[Math.floor(Math.random() * this.staticMessages.length)]; break;
            }
            this.currentState = (this.currentState + 1) % 4;
        }
        this.currentComponent = currentComponent;
        this.timestamp = Date.now();
    }

    /*upcomingRun() {
      return { name: UpcomingRun.name };
    },*/
    prize() {
      return { name: Prize.name, data: {} };
    },
    bid(): TickerMessage {
      return { name: Bid.name, data: {} };
    }

    donation(donation: TrackerDonation): TickerMessage {
      const line1 = `New Donation: ${donation.donor} (${this.formatUSD(donation.amount)})`;
      const line2 = donation.comment;
      return this.alert(line1, line2);
    }

    alert(line1Text: string, line2Text: string): TickerMessage {
        return {
            name: Alert.name,
            data: {
                line1Text,
                line2Text,
            },
        };
    }

    formatUSD(amount: number): string {
      return `$${amount.toFixed(2)}`;
    }
}
</script>

<style scoped>
  #Ticker {
    height: 100%;
    flex: 1;
    display: flex;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>