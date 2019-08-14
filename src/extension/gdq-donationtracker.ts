'use strict';

// Note: This uses a fork from the GDQ donation tracker (https://github.com/bingothon/bingothon-donation-tracker)
// that exposes some feeds, inspired by the PowerupWithPride fork (https://github.com/PowerUpWithPride/donation-tracker-toplevel)

import * as nodecgApiContext from './util/nodecg-api-context';
import equal = require('deep-equal');
import needle from 'needle';
import { TrackerOpenBids, TrackerDonations, DonationTotal } from "../../schemas";


const nodecg = nodecgApiContext.get();


if (nodecg.bundleConfig && nodecg.bundleConfig.donationtracker && nodecg.bundleConfig.donationtracker.enable) {
	const donationTotalReplicant = nodecg.Replicant <DonationTotal>('donationTotal');
	const openBidsReplicant = nodecg.Replicant<TrackerOpenBids>('trackerOpenBids');
	const donationsReplicant = nodecg.Replicant <TrackerDonations>('trackerDonations');
	const feedUrl = nodecg.bundleConfig.donationtracker.url;
	const eventSlug = nodecg.bundleConfig.donationtracker.eventSlug;
	function doUpdate() {
		// current donation total
		needle.get(feedUrl + "/feed/current_donations/" + eventSlug, function (err, response) {
			if (err || !response.body || response.statusCode != 200) {
				nodecg.log.warn("error getting donation total!");
			} else {
				donationTotalReplicant.value = response.body.total;
				nodecg.log.info("Updating donation total to " + donationTotalReplicant.value);
			}
		});

		// all bids that are open
		needle.get(feedUrl + "/feed/upcoming_bids/" + eventSlug, function (err, response) {
			if (err || !response.body || response.statusCode != 200) {
				nodecg.log.warn("error getting bids!");
			} else {
				if (!equal(openBidsReplicant.value, response.body.results)) {
					openBidsReplicant.value = response.body.results;
					nodecg.log.info("Updating upcoming bids to " + JSON.stringify(openBidsReplicant.value));
				}
			}
		});

		// last 20 donations (limited by the tracker)
		// TODO: send out event on new donation
		needle.get(feedUrl + "/feed/donations/" + eventSlug, function (err, response) {
			if (err || !response.body || response.statusCode != 200) {
				nodecg.log.warn("error getting donations!");
			} else {
				if (!equal(donationsReplicant.value, response.body.results)) {
					donationsReplicant.value = response.body.results;
					nodecg.log.info("Updating donations to " + JSON.stringify(donationsReplicant.value));
				}
			}
		});
	}
	doUpdate();
	setInterval(doUpdate, 30000);
} else {
	nodecg.log.warn("donationtracker isn't enabled!");
}
