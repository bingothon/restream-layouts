'use strict';

// Note: This uses a fork from the GDQ donation tracker (https://github.com/bingothon/bingothon-donation-tracker)
// that exposes some feeds, inspired by the PowerupWithPride fork (https://github.com/PowerUpWithPride/donation-tracker-toplevel)

import * as nodecgApiContext from './util/nodecg-api-context';
import equal = require('deep-equal');
import * as RequestPromise from 'request-promise';
import { TrackerOpenBids, TrackerDonations, DonationTotal } from "../../schemas";


const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger(`${nodecg.bundleName}:donationtracker`);
const client = RequestPromise.defaults({});


if (nodecg.bundleConfig && nodecg.bundleConfig.donationtracker && nodecg.bundleConfig.donationtracker.enable) {
	const donationTotalReplicant = nodecg.Replicant <DonationTotal>('donationTotal');
	const openBidsReplicant = nodecg.Replicant<TrackerOpenBids>('trackerOpenBids');
	const donationsReplicant = nodecg.Replicant <TrackerDonations>('trackerDonations');
	const feedUrl = nodecg.bundleConfig.donationtracker.url;
	const eventSlug = nodecg.bundleConfig.donationtracker.eventSlug;
	function doUpdate() {
		// current donation total
		client.get(feedUrl + "/feed/current_donations/" + eventSlug, {json: true})
			.then(data => {
				if (data.total != donationTotalReplicant.value) {
					donationTotalReplicant.value = data.total;
					log.info(`donation total updated to ${data.total}`);
				}
			})
			.catch(err => {
				log.error("error getting donation total: ", err);
			});

		// all bids that are open
		client.get(feedUrl + "/feed/upcoming_bids/" + eventSlug, {json: true})
			.then(data => {
				if (!equal(openBidsReplicant.value, data.results)) {
					openBidsReplicant.value = data.results;
					log.info(`bids updated to ${JSON.stringify(data.results)}`);
				}
			})
			.catch(err => {
				log.error("error getting bids: ", err);
			});


		// last 20 donations (limited by the tracker)
		// TODO: send out event on new donation
		client.get(feedUrl + "/feed/donations/" + eventSlug, {json: true})
			.then(data => {
				if (!equal(donationsReplicant.value, data.results)) {
					donationsReplicant.value = data.results;
					log.info(`donations updated to ${JSON.stringify(data.results)}`);
				}
			})
			.catch(err => {
				log.error("error getting donations: ", err);
			});
	}
	doUpdate();
	setInterval(doUpdate, 30000);
} else {
	log.warn("not enabled!");
}
