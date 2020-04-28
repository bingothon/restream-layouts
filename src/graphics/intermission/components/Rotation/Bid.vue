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
				<svg ref="piesvg" width="1100" height="425"></svg>
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
					this.makePie(this.bid);
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
        makePie(bid : TrackerOpenBid) {
        	let options = bid.options;
        	let data = [];
        	options.forEach( (option) => {
        		data.push({value: option.amount_raised, name: option.name});
        		//data.push(option.amount_raised);
			});
			let svg = d3.select(this.$refs.piesvg);
			let	width = svg.attr("width"),
				height = svg.attr("height"),
				radius = Math.min(width, height) / 2;
			let g = svg.append("g").attr("transform", "translate(" + width/2 + "," + height/2 + ")");
			let color = d3.scaleOrdinal(['#3f84e5','#faa300','#f63e02','#a41623', '#2f4858']);
			var pie = d3.pie()
				.value(function(d) { return d.value; });
			//sorts by descending amount
			pie.sortValues(function(a, b) { return b - a; });
			// Generate the arcs
			var arc = d3.arc()
				.innerRadius(0)
				.outerRadius(radius);
			var label = d3.arc()
				.outerRadius(radius)
				.innerRadius(radius - 80);
			//Generate groups
			var arcs = g.selectAll("arc")
				.data(pie(data))
				.enter()
				.append("g")
				.attr("class", "arc")
			//Draw arc paths
			arcs.append("path")
				.attr("fill", function(d, i) {
					return color(i);
				})
				.attr("d", arc);
			arcs.append("text")
				.attr("transform", function(d) {
					var c = label.centroid(d);
					let cx = 0;
					if (c[0] < Math.PI) {
						cx = c[0];
					} else {
						cx = c[0] * 1.4;
					}
					let cy = c[1] * 1.2;
					return "translate(" + cx + "," + cy + ")";
				})
				.text(function(d) { return d.data.name + " ($" + d.data.value + ")"; });
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
		font-color: white;
	}
	.arc text {
		text-anchor: middle;
	}
</style>