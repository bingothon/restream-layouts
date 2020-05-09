<template>
	<div
		v-if="bid"
		id="Bid"
	>
		<div class="Header">
      <span v-if="bid.goal">
        Upcoming Goal
      </span>
	  <span v-else>
        Upcoming Bid War
      </span>
		</div>
		<div class="Body">
			<div class="RunName">
				{{ bid.game }} - {{ bid.category }}
			</div>
			<div class="BidName">
				{{ bid.bid }}
			</div>
			<div class="bid-graphics"></div>
			<div
				v-if="bid.goal!=null"
				class="BidAmount"
			>
				{{ formatUSD(bid.amount_raised) }}/{{ formatUSD(bid.goal) }}
			</div>
			<div
				v-else
				class="BidAmount"
			>
				<div v-if="bid.options.length">
					<!--
					<div
						v-for="option in bid.options"
						:key="`${option.name}${option.amount_raised}`"
					>
						{{ option.name }} ({{ formatUSD(option.amount_raised) }})
					</div>-->
				
					<div v-if="bid.allow_custom_options">
						...or you could submit your own idea!
					</div>

				</div>
				<div v-else-if="bid.allow_custom_options">
					No options submitted yet, be the first!
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
    import clone from 'clone';
    import { TrackerOpenBid } from "../../../../../types";
    import { Component, Vue } from 'vue-property-decorator';
    import {store} from "../../../../browser-util/state";
	import * as d3 from 'd3';
    @Component({})
    export default class Bid extends Vue {
        bid : TrackerOpenBid = null;
        mounted() {
            const chosenBid = this.getRandomBid();
            if (!chosenBid) {
                this.$emit('end');
            } else {
                this.bid = clone(chosenBid);
            }
			this.bid = clone(chosenBid);
			if (this.bid.options && this.bid.options.length > 0) {
				this.$nextTick(() => {
					this.makeBars(this.bid);
				});
			}
            setTimeout(() => this.$emit('end'), 20 * 1000);
        }
        formatUSD(amount) {
			return `$${amount.toFixed(2)}`;
		}
        getRandomBid(): TrackerOpenBid {
            let openBids = store.state.trackerOpenBids.filter(bid => {
                // goal is null for bid wars
                if (bid.goal == null) {
                    // bid wars are closed manually
                    return bid.state == "OPENED";
                } else {
                    // Incentives close as soon as the needed amount is reached
                    // we still want to display them until the run starts
                    return !bid.run_started;
                }
            });
            if (openBids.length) {
                return openBids[Math.floor(Math.random() * openBids.length)];
            } else {
                return null;
            }
        }

		makeBars(bid: TrackerOpenBid) {
			let options = bid.options;
			let data = [];
			options.forEach( (option) => {
				data.push({name: option.name, value: option.amount_raised});
				//data.push(option.amount_raised);
			});

			data = data.sort(function (a, b) {
            	return d3.ascending(a.value, b.value);
			})

			//set up svg using margin conventions - we'll need plenty of room on the left for labels
			var margin = {
				top: 0,
				right: 200,
				bottom: 15,
				left: 540
			};

			var color = d3.scale.ordinal().range(['#3f84e5','#faa300','#f63e02','#a41623', '#2f4858']);

			var width = 1100 - margin.left - margin.right,
				height = 400 - margin.top - margin.bottom;

			var svg = d3.select(".bid-graphics").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var x = d3.scale.linear()
				.range([0, width])
				.domain([0, d3.max(data, function (d) {
					return d.value;
				})]);

			var y = d3.scale.ordinal()
				.rangeRoundBands([height, 0], .1)
				.domain(data.map(function (d) {
					return d.name;
				}));

			//make y axis to show bar names
			var yAxis = d3.svg.axis()
				.scale(y)
				//no tick marks
				.tickSize(0)
				.orient("left");

			var gy = svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)

			var bars = svg.selectAll(".bar")
				.data(data)
				.enter()
				.append("g")

			//append rects
			bars.append("rect")
				.attr("class", "bar")
				.attr("y", function (d) {
					return y(d.name);
				})
				.style("fill", function(d, i) {
    				return color(i);
  				})
				.attr("height", y.rangeBand())
				.attr("x", 0)
				.attr("width", function (d) {
					return x(d.value);
				});

			//add a value label to the right of each bar
			bars.append("text")
				.attr("class", "label")
				//y position of the label is halfway down the bar
				.attr("y", function (d) {
					return y(d.name) + y.rangeBand() / 2 + 4;
				})
				//x position is 3 pixels to the right of the bar
				.attr("x", function (d) {
					return x(d.value) + 3;
				})
				.text(function (d) {
					return d.value;
				});
		}
	};
</script>

<style>
	#Bid {
		position: absolute;
		display: flex;
		height: 100%;
		width: 100%;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		text-align: center;
	}
	#Bid > .Header {
		width: 100%;
		font-weight: 500;
		height: 60px;
		line-height: 60px;
		background-color: var(--border-colour);
		color: white;
		font-size: 41px;
		text-transform: uppercase;
	}
	#Bid > .Body {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		background-color: rgba(0,0,0,0.3);
	}
	#Bid > .Body > div {
		margin: 10px;
	}
	#Bid > .Body > .RunName {
		font-size: 45px;
	}
	#Bid > .Body > .BidName {
		font-size: 32px;
	}
	#Bid > .Body > .BidAmount {
		font-size: 40px;
	}
	svg {
		font-size: 25px;
		color: white;
	}
	.arc text {
		text-anchor: middle;
	}

	.axis {
		font-size: 25px;
		fill: #fff;
	}
	
	.axis path,
	.axis line {
		fill: none;
		display: none;
	}
	
	.label {
		font-size: 13px;
	}

	.bid-graphics{
		width:1172px;
		height: 400px;
	}
</style>
