<template>
	<div id="HostDashboard">
		<div id="intermission-live-warning" v-if="hostsSpeakingDuringIntermission">You are currently live on stream</div>
		<button
			@click="toggleHostsSpeakingDuringIntermission"
			:disabled="!hostsCanGoLive"
			id="Go-Live-Button"
		>
			{{hostsSpeakingToggleButtonText}}
		</button>
		<div id="Go-Live">
			Go live on stream during intermission
		</div>
		<div v-if="hostsCanGoLive">
			Time since last intermission start: {{ timeSinceLastIntermission }}
		</div>
		<div id="columnsWrapper">
		<div id="column1" class="column">
			<div id="PEFacts">
				<div class="fact">
					{{peFacts[factIndex]}}
				</div>
				<button v-on:click="updateFactIndex()">Update Text</button>
			</div>
			<div id="bidsHeader">Upcoming Goals/Bidwars:</div>
			<div id="bidsContainer">
                <div
                    class="bid"
                    v-for="(bid,i) in openBids"
                    :key="i"
                >
                {{bid.game}} - {{bid.bid}}
                    <div
                        v-if="bid.goal"
                    >
                        <div class="bidRaised">
                            {{formatDollarAmount(bid.amount_raised, true)}} / {{formatDollarAmount(bid.goal, true)}}
                        </div>
                        <div class="bidLeft">
                            {{formatDollarAmount(bid.goal - bid.amount_raised, true)}} left to go!
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="bid.options.length">
                            <div
                                class="bidOption"
                                v-for="(option, j) in bid.options"
                                :key="i + ' ' + j"
                            >
                                {{option.name}} - {{formatDollarAmount(option.amount_raised, true)}}
                            </div>
                            <div v-if="bid.allow_custom_options" class="customOptions"> Users can submit their own options </div>
                        </div>
                        <div v-else class="NoOptions"> No options submitted yet.</div>
                    </div>
                </div>
            </div>
		</div>
		<div id="column2" class="column">
			<div id="scheduleHeader">Run Schedule:</div>
			<div id="runsContainer">
					<div id="currentRunInfo" class="run">
						Running right now:
						<div>
							{{currentRun.game}} - {{currentRun.category}}
							<div class="runners">
								{{runnersToString(currentRun)}}
							</div>
						</div>
					</div>
					<div id="comingUpInfo" class="run" v-if="comingUpRun">
						Coming Up:
						<div>
							{{comingUpRun.game}} - {{comingUpRun.category}}
							<div class="runners">
								{{runnersToString(comingUpRun)}}
							</div>
						</div>
					</div>
					<div id="afterThatInfo" class="run" v-if="afterThatRun">
						And next:
						<div>
							{{afterThatRun.game}} - {{afterThatRun.category}}
							<div class="runners">
								{{runnersToString(afterThatRun)}}
							</div>
						</div>
					</div>
			</div>
		</div>
		<div id="column3" class="column">
            <div>
                Paste the entire image Url here: <input v-model="pictureDuringIntermissionUrl">
                <button @click="clearPicture">Clear picture</button>
            </div>
			<div id="donationTotalHeader">Donation Total:</div>
			<div id="donationTotal">{{donationTotal}}</div>
			<br>
			<div id="prizesHeader">Currently Available Prizes:</div>
			<div id="prizesContainer">
				<div
					class="prize"
					v-for="(prize,k) in prizes"
					:key="k"
				>
					<div class="prizeName">
						{{prize.name}}
					</div>
					<div class="prizeInfo">
						Provided by {{prize.provider}}
					</div>
					<div class="prizeInfo">
						Minimum Donation: {{formatDollarAmount(prize.minDonation, true)}}
					</div>
					<div class="prizeInfo">
						{{getPrizeTimeUntilString(prize)}}
					</div>
				</div>
			</div>
		</div>
		<div id="column4" class="column">
			<div id="HostingBingo">
				<bingo-board class="BingoBoard" id="Bingo-board" bingoboardRep="hostingBingoboard" :alwaysShown="true" fontSize="25px"></bingo-board>
			</div>
		</div>
	</div>
	</div>
</template>

<script lang="ts">
const CHARITY_FACTS = `Using coronavirus DNA crowd-sourced from scientists around the world, experts at Fred Hutch and the University of Basel in Switzerland are tracking how the virus is changing as it moves through people and countries, using the open-source platform Nextstrain.org, where they can share all their data
Scientists and public health officials around the world are using nextstrain.org to monitor the pandemic and slow the spread of infection.
Fred Hutch is aiming to help additional labs sequence the virus and share the information; not just for Nextstrain.org, but for all scientists working to address this health crisis. 
The Nextstrain team has been ahead of the curve in sounding the alarm on the severity and spread of the coronavirus and the disease it causes, COVID-19, all thanks to the modeling work and tracking of outbreaks from Dr. Trevor Bedford from Fred Hutch.
Dr. Trevor Bedford at Fred Hutch has been at the forefront of tracking outbreaks, from seasonal flu to Zika and Ebola, often advising the CDC and other health officials around the world. 
Dr. Trevor Bedford collaborates broadly within Fred Hutch and across the world, including colleagues from the University of Basel in Switzerland to ensure the speed of response to emerging outbreaks, of course including the COVID-19 pandemic, and is sharing the data on Nextstrain.org, where users can see the changes happening in the virus and how it is spreading across the world.
State, local, and national governments rely on Dr. Trevor Bedford for best information on forecasting the continued spread of the disease.
Nextstrain is a critical tool that allows researchers to stay ahead of COVID-19 as well as other diseases that could affect a large segment of the population.`;


	import {Component, Vue} from "vue-property-decorator";
    import {store, getReplicant} from "../../browser-util/state";
    import {TrackerPrize} from "../../../types";
    import moment from 'moment';
    import fs from "fs";
    import {RunData} from "../../../speedcontrol-types";
    import BingoBoard from "../components/bingoboard.vue";
    import { HostsSpeakingDuringIntermission, ShowPictureDuringIntermission } from "../../../schemas";

    @Component({
		components: {
			BingoBoard
		}
	})

    export default class HostDashboard extends Vue {
		private factIndex: number = 0;
		
		timeSinceLastIntermission: string = '';
		lastIntermissionInterval: NodeJS.Timeout | null = null;

		mounted() {
			this.lastIntermissionInterval = setInterval(() => {
			const totalS = ((new Date().getTime() / 1000) - store.state.lastIntermissionTimestamp);
			const mins = (totalS / 60).toFixed(0);
			const secs = (totalS % 60).toFixed(0);
			this.timeSinceLastIntermission = mins + ":" + secs.padStart(2, "0");
			}, 1000);
		}

		destroyed() {
			if (this.lastIntermissionInterval) {
			clearInterval(this.lastIntermissionInterval);
			this.lastIntermissionInterval = null;
			}
		}

        get donationTotal() {
           return this.formatDollarAmount(store.state.donationTotal, true);
	   }

	   get prizes() {
           return store.state.trackerPrizes;//probably needs to be formatted
	   }

	   get openBids() {
           return store.state.trackerOpenBids.filter(b => b.state === 'OPENED');
	   }

	   get currentRun() {
            return store.state.runDataActiveRun;
	   }

	   get comingUpRun() : RunData {
            return this.getNextRuns(this.currentRun, 1);
	   }

	   get afterThatRun() : RunData {
            return this.getNextRuns(this.currentRun, 2);
       }

       get hostsSpeakingDuringIntermission(): boolean {
           return store.state.hostsSpeakingDuringIntermission.speaking;
       }

       // only during intermission
       get hostsCanGoLive(): boolean {
           return store.state.obsCurrentScene == 'intermission';
       }

       get hostsSpeakingToggleButtonText(): string {
           if(!this.hostsCanGoLive) {
               return "(Disabled)";
           } else if (this.hostsSpeakingDuringIntermission) {
               return "Mute";
           } else {
               return "Unmute on stream";
           }
       }

       toggleHostsSpeakingDuringIntermission() {
            getReplicant<HostsSpeakingDuringIntermission>('hostsSpeakingDuringIntermission').value.speaking = !store.state.hostsSpeakingDuringIntermission.speaking;
       }

       clearPicture() {
           this.pictureDuringIntermissionUrl = null;
       }

	   runnersToString (run : RunData) : string {
            let res = '';
            let j = 0;
            run.teams.forEach(team => {
                if (team.name) {
                    res = res + team.name + ': ';
				}
                let i = 0;
                team.players.forEach(player => {
                    res += player.name;
                    if (i === (team.players.length - 1)) {//if current player is last player of team
                        if (j === (run.teams.length - 1)) {//and last team of the run
                            //do nothing
                        } else {
                            res += ' vs. ';//if not last team then addd vs.
                        }
                    } else {
                        res += ' & '; //if not last player of team add &
                    }
                	i++;
				})
            	j++;
			})
            return res;
	}

        // Formats dollar amounts to the correct string.
		formatDollarAmount(amount :number, forceRemoveCents : boolean) : string {
              // We drop the cents and add a comma over $1000.
            if (amount < 1000 && !forceRemoveCents)
                return '$' + amount.toFixed(2);
            else
                return '$' + Math.round(amount).toLocaleString('en-US', { minimumFractionDigits: 0 });
        }

        get peFacts() : String[] {
            return CHARITY_FACTS.split('\n');
		}

		updateFactIndex() {
            this.factIndex = (this.factIndex + 1) % (this.peFacts.length - 1);
		}

        // Get the next Xth run in the schedule.
        getNextRuns(runData : RunData, X : number) : RunData {
            let runDataArray = store.state.runDataArray;
            let indexOfCurrentRun = this.findIndexInRunDataArray(runData);
            let nextRuns = runDataArray[indexOfCurrentRun + X];
            return nextRuns;
        }

        // Find array index of current run based on it's ID.
        findIndexInRunDataArray(run : RunData) : number {
            let indexOfRun = -1;
            let runDataArray = store.state.runDataArray;

            // Completely skips this if the run variable isn't defined.
            if (run) {
                for (let i = 0; i < runDataArray.length; i++) {
                    if (run.id === runDataArray[i].id) {
                        indexOfRun = i; break;
                    }
                }
            }
            return indexOfRun;
        }

        get pictureDuringIntermissionUrl(): string {
            return store.state.showPictureDuringIntermission.imageUrl;
        }

        set pictureDuringIntermissionUrl(url: string) {
            getReplicant<ShowPictureDuringIntermission>('showPictureDuringIntermission').value.imageUrl = url;
        }

    // calculate the time until the prize period ends and render it as a human readable string ("an hour", "20 minutes")
	getPrizeTimeUntilString(prize: TrackerPrize) {
        if (prize.endtime) {
            let timeUntil = moment(prize.endtime).fromNow(true);
            timeUntil = timeUntil.replace('an ', ''); // Dirty fix for "Donate in the next an hour".
            timeUntil = timeUntil.replace('a ', ''); // Dirty fix for "Donate in the next a day".
            return `Donate in the next ${timeUntil}`;
        } else {
            return `Donate until the end of the event`;
        }
	}
    }
</script>

<style>

	body {
		background-color: black;
	}

	#HostDashboard {
		color: white;
		background-color: black;
		height: 2000px;
		width: 1920px;
		position: absolute;
		left: 0px;
		top: 0px;
	}

	#columnsWrapper {
		height: inherit;
		width: inherit;
		display: flex;
	}

	.column {
		height: inherit;
		width: 25%;
		display: flex;
		align-items: center; /* Aligns horizontally centre. */
		flex-direction: column;
		padding: 0 10px;
	}

	#donationTotalHeader, #prizesHeader, #bidsHeader, #scheduleHeader, #unReadDonationsHeader, #videoHeader {
		font-size: 45px;
		text-align: center;
	}

	#donationTotal {
		font-size: 100px;
		padding-bottom: 30px;
	}

	#unReadDonationsContainer {
		font-size: 40px;
	}

	#unReadDonationsContainer li {
		padding-bottom: 20px;
	}

	#prizesContainer, #bidsContainer, #runsContainer, #PEFacts {
		width: 100%;
	}

	.prize:first-child, .bid:first-child, .run:first-child {
		margin-top: 10px;
		border-top: 5px solid white;
	}

	.fact {
		width: 100%;
		font-size: 30px;
		padding: 20px 0;
		text-align: center;
	}

	button {
		font-size: 15px;
		text-align: center;
		align-content: center;
	}

	.prize, .bid, .run {
		width: 100%;
		font-size: 30px;
		padding: 20px 0;
		text-align: center;
		border-bottom: 5px solid white;
	}

	.prizeName, .bidGame, .gameName {
		font-size: 45px;
	}

	.bidName:after {
		content: ':';
	}

	.gameTime:before {
		content: 'ESTIMATE: '
	}

	.gameFinal:before {
		content: 'FINAL TIME: '
	}

    #intermission-live-warning {
        width:100%;
        height: 50px;
        background-color: red;
        text-align: center;
        font-size: 40px;
    }

	#HostingBingo {
		width: 100%;
	}

	#HostingBingo > .BingoBoard {
		width: 100%;
		padding-bottom: 100%;
		position: relative;
	}

	#Go-Live {
		font-size: 30px;
	}

	#Go-Live-Button {
		background-color: red;
		color: white;
	}

</style>
