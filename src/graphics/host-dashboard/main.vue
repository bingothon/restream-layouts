<template>
	<div id="HostDashboard">
	<div id="columnsWrapper">
		<div id="column1" class="column">
			<div id="bidsHeader">Upcoming Goals/Bidwars:</div>
			<div id="bidsContainer">{{bids}}</div>
		</div>
		<div id="column2" class="column">
			<div id="scheduleHeader">Run Schedule:</div>
			<div id="runsContainer"></div>
		</div>
		<div id="column3" class="column">
			<div id="donationTotalHeader">Donation Total:</div>
			<div id="donationTotal">{{donationTotal}}</div>
			<br>
			<div id="prizesHeader">Currently Available Prizes:</div>
			<div id="prizesContainer">{{prizes}}</div>
		</div>
	</div>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from "vue-property-decorator";
    import {store} from "../../browser-util/state";
    import {TrackerPrize} from "../../../types";
    import moment from 'moment';
    import {TrackerOpenBids} from "../../../schemas";

    @Component({})

    export default class HostDashboard extends Vue {
       /* $(() => {
        // JQuery selectors.
        var donationTotalElement = $('#donationTotal');
        var prizesContainer = $('#prizesContainer');
        var bidsContainer = $('#bidsContainer');
        var runsContainer = $('#runsContainer');*/

        // Declaring variables.
        /*
        var bidHTML = $('<div class="bid"><span class="bidGame"></span><br><span class="bidName"></span></div>')
        var runHTML = $('<div class="run"><span class="justMissed">YOU HAVE JUST WATCHED<br></span><span class="gameName"></span><br><span class="gameCategory"></span><br><span class="gameConsole"></span><br><span class="gameRunners"></span><br><span class="gameTime"></span><br><span class="gameFinal"></span></div>');
*/
       get donationTotal() {
           return this.formatDollarAmount(store.state.donationTotal, true);
	   }

	   get prizes() {
           return this.formatPrizes(store.state.trackerPrizes);//probably needs to be formatted
	   }

	   get bids() {
           return this.formatBids(store.state.trackerOpenBids);//format?
	   }

	   // Keep prizes updated.
		formatPrizes(trackerPrizes : TrackerPrize[]) :string {
           	let prizes : string = "";
            trackerPrizes.forEach(prize => {
                prizes += (prize.name +
                    " provided by " +
                    prize.provider +
                    " minimum donation " +
                    this.formatDollarAmount(prize.minDonation, true) +
                    this.getPrizeTimeUntilString(prize) + '\n\n'
                );
            });
            return prizes;
        }

        // Formats dollar amounts to the correct string.
		formatDollarAmount(amount :number, forceRemoveCents : boolean) : string {
              // We drop the cents and add a comma over $1000.
            if (amount < 1000 && !forceRemoveCents)
                return '$' + amount.toFixed(2);
            else
                return '$' + Math.floor(amount).toLocaleString('en-US', { minimumFractionDigits: 0 });
        }

        formatBids(trackerBids : TrackerOpenBids) : string {
            let bids : string = '';
            let i : number = 0;
            trackerBids.forEach(bid => {
                if (i <= 2) {
                    bids += '<div class="bid"> ' + bid.game + ' - ' + bid.bid + '</div>';
                    if (bid.goal) {
                        bids += '<div class="bidRaised"> ' + this.formatDollarAmount(bid.amount_raised, true) + '/'
							+ this.formatDollarAmount(bid.goal, true) + '</div>';
                        bids += '<div class="bidLeft"> ' + this.formatDollarAmount(bid.goal - bid.amount_raised, true) + ' left to go' + '</div>';
                    } else {
                        if (bid.options.length) {
                            bid.options.forEach(option => {
                                bids += '<div class="bidOption"> ' + option.name + ' - ' + option.amount_raised + '</div>';
                            })
                            if (bid.allow_custom_options) {
                                bids += '<div class="customOptions"> Users can submit their own options </div>';
                            }/* else {
                                bids += '\n';
                            }*/
                        } else {
                            bids += '<div class="NoOptions"> No options submitted yet.</div>'
                        }
                    }
                }
                i++;
		    })
		    return bids;
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

    // Find array index of current run based on it's ID.
    function findIndexInRunDataArray(run) {
        var indexOfRun = -1;
        var runDataArray = store.state.runDataArray;

        // Completely skips this if the run variable isn't defined.
        if (run) {
            for (var i = 0; i < runDataArray.length; i++) {
                if (run.id === runDataArray[i].id) {
                    indexOfRun = i; break;
                }
            }
        }

        return indexOfRun;
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

<style scoped>

	body {
		height: 100%;
		width: 100%;
		background-color: black;
	}

	#HostDashboard {
		color: white;
		background-color: black;
		height: 1080px;
		width: 1920px;
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

	#prizesContainer, #bidsContainer, #runsContainer, #unReadDonationsContainer {
		width: 100%;
	}

	.prize:first-child, .bid:first-child, .run:first-child {
		margin-top: 10px;
		border-top: 5px solid white;
	}

	.prize, .bid, .run {
		width: 100%;
		font-size: 40px;
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

</style>
