<template>
	<div id="HostDashboard">
    <div id="intermission-live-warning" v-if="hostsSpeakingDuringIntermission">You are currently live on stream</div>
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
            <div>Go live on stream during intermission:<br>
                <button
                    @click="toggleHostsSpeakingDuringIntermission"
                    :disabled="!hostsCanGoLive"
                >{{hostsSpeakingToggleButtonText}}</button></div>
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
	</div>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from "vue-property-decorator";
    import {store, getReplicant} from "../../browser-util/state";
    import {TrackerPrize} from "../../../types";
    import moment from 'moment';
    import fs = require('fs');
    import {RunData} from "../../../speedcontrol-types";
import { HostsSpeakingDuringIntermission, ShowPictureDuringIntermission } from "../../../schemas";

    @Component({})

    export default class HostDashboard extends Vue {
        private factIndex: number = 0;

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
                return '$' + Math.floor(amount).toLocaleString('en-US', { minimumFractionDigits: 0 });
        }

        get peFacts() : String[] {
            const text = fs.readFileSync('src/graphics/host-dashboard/pefacts.txt', 'utf-8');
            return text.split('\n');
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

    /*//var runFinishTimes = store.state.runDataActiveRun.
    //var runFinishTimesInit = false;
    var runDataActiveRunInit = false;
    /*var runsInit = false;
    runFinishTimes.on('change', newVal => {
        runFinishTimesInit = true;
        if (!runsInit && runFinishTimesInit && runDataActiveRunInit) {
            setRuns();
            runsInit = true;
        }
    });
    runDataActiveRun.on('change', newVal => {
        runDataActiveRunInit = true;
        if (runFinishTimesInit && runDataActiveRunInit) {
            setRuns();
            runsInit = true;
        }
    });*/

    /*function setRuns() {
        var runDataArray = store.state.runDataArray;
        var runDataActiveRun = store.state.runDataActiveRun;
        var indexOfCurrentRun = findIndexInRunDataArray(runDataActiveRun);
        for (var i = -1; i < 2; i++) {
            var run = runDataArray.value[indexOfCurrentRun+i];
            if (run) {
                var runElement = runHTML.clone();
                if (i === -1) {
                    $('.justMissed', runElement).show();
                    if (runFinishTimes.value[runDataActiveRun.value.id-1]) {
                        $('.gameFinal', runElement).html(runFinishTimes.value[runDataActiveRun.value.id-1]);
                        $('.gameFinal', runElement).show();
                    }
                }
                else {
                    $('.justMissed', runElement).hide();
                    $('.gameFinal', runElement).hide();
                }
                $('.gameName', runElement).html(run.game);
                $('.gameCategory', runElement).html(run.category);
                $('.gameConsole', runElement).html(run.system);
                $('.gameRunners', runElement).html(formPlayerNamesString(run));
                $('.gameTime', runElement).html(run.estimate);
                runsContainer.append(runElement);
            }
        }
    }

    // Get the next X runs in the schedule.
    function getNextRuns(runData, amount) {
        var nextRuns = [];
        var indexOfCurrentRun = findIndexInRunDataArray(runData);
        for (var i = 1; i <= amount; i++) {
            if (!runDataArray.value[indexOfCurrentRun + i]) break;
            nextRuns.push(runDataArray.value[indexOfCurrentRun + i]);
        }
        return nextRuns;
    }

    // Returns how long until a run, based on the estimate of the previous run.
    function formETAUntilRun(previousRun, whenTotal) {
        var whenString = '';
        if (!previousRun) whenString = 'Next';
        else {
            var previousRunTime = previousRun.estimateS + previousRun.setupTimeS;
            var formatted = moment.utc().second(0).to(moment.utc().second(whenTotal + previousRunTime), true);
            whenString = 'In about ' + formatted;
            whenTotal += previousRunTime;
        }
        return [whenString, whenTotal];
    }

    // Converts milliseconds to a time string.
    function msToTime(duration, noHour) {
        var seconds = parseInt((duration / 1000) % 60),
            minutes = parseInt((duration / (1000 * 60)) % 60),
            hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;

        var timeString = '';

        if (!noHour)
            timeString += hours + ':';
        timeString += minutes + ':' + seconds;

        return timeString;
    }

    // Goes through each team and members and makes a string to show the names correctly together.
    function formPlayerNamesString(runData) {
        var namesArray = [];
        var namesList = 'No Player(s)';
        runData.teams.forEach(team => {
            var teamPlayerArray = [];
            team.players.forEach(player => { teamPlayerArray.push(player.name); });
            namesArray.push(teamPlayerArray.join(', '));
        });
        if (namesList.length) namesList = namesArray.join(' vs. ');
        return namesList;
    }

    // Returns the total amount of players a run has.
    function checkForTotalPlayers(runData) {
        var amount = 0;
        runData.teams.forEach(team => team.players.forEach(player => amount++));
        return amount;
    }

    // Get a random integer, usually for selecting array elements.
    // You will never get max as an output.
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function getRandomFloat(max) {
        return Math.random() * max;
    }

    // Used to get the width of supplied text.
    function getTextWidth(text, size) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        ctx.font = size + 'px "Barlow Condensed"'; // Change if layout is changed.
        return ctx.measureText(text).width;
    }*/

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
/*
    // Change if an element is visible or not.
    function changeVisibility(elem, isVisible) {
        $(elem).css({
            visibility: isVisible ? 'visible' : 'hidden'
        });
    }

    function createAssetArrayWithChances(arr) {
        var newArr = [];
        arr.forEach(asset => {
            for (var i = 0; i < asset.chance; i++) {
                newArr.push(asset);
            }
        });
        return newArr;
    }
    });*/
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
		width: 33%;
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

</style>
