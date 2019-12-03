

// Note: This uses a fork from the GDQ donation tracker (https://github.com/bingothon/bingothon-donation-tracker)
// that exposes some feeds, inspired by the PowerupWithPride fork (https://github.com/PowerUpWithPride/donation-tracker-toplevel)

import * as RequestPromise from 'request-promise';
import * as nodecgApiContext from './util/nodecg-api-context';
import {
  TrackerOpenBids, TrackerDonations, DonationTotal, TrackerPrizes,
} from '../../schemas';

import equal = require('deep-equal');


const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger(`${nodecg.bundleName}:donationtracker`);
const client = RequestPromise.defaults({});


if (nodecg.bundleConfig && nodecg.bundleConfig.donationtracker && nodecg.bundleConfig.donationtracker.enable) {
  const donationTotalReplicant = nodecg.Replicant <DonationTotal>('donationTotal');
  const openBidsReplicant = nodecg.Replicant<TrackerOpenBids>('trackerOpenBids');
  const donationsReplicant = nodecg.Replicant <TrackerDonations>('trackerDonations');
  const prizesReplicant = nodecg.Replicant<TrackerPrizes>('trackerPrizes');
  const feedUrl = nodecg.bundleConfig.donationtracker.url;
  const { eventSlug } = nodecg.bundleConfig.donationtracker;
  function doUpdate() {
    // current donation total
    client.get(`${feedUrl}/feed/current_donations/${eventSlug}`, { json: true })
      .then((data) => {
        if (data.total != donationTotalReplicant.value) {
          donationTotalReplicant.value = data.total;
          log.info(`donation total updated to ${data.total}`);
        }
      })
      .catch((err) => {
        log.error('error getting donation total: ', err);
      });

    // all bids that are open
    client.get(`${feedUrl}/feed/upcoming_bids/${eventSlug}`, { json: true })
      .then((data) => {
        if (!equal(openBidsReplicant.value, data.results)) {
          openBidsReplicant.value = data.results;
          log.info(`bids updated to ${JSON.stringify(data.results)}`);
        }
      })
      .catch((err) => {
        log.error('error getting bids: ', err);
      });


    // last 20 donations (limited by the tracker)
    // TODO: send out event on new donation
    client.get(`${feedUrl}/feed/donations/${eventSlug}`, { json: true })
      .then((data) => {
        if (!equal(donationsReplicant.value, data.results)) {
          donationsReplicant.value = data.results;
          log.info(`donations updated to ${JSON.stringify(data.results)}`);
        }
      })
      .catch((err) => {
        log.error('error getting donations: ', err);
      });
    // get prizes
    client.get(`${feedUrl}/feed/prizes/${eventSlug}`, { json: true })
      .then((data) => {
        if (!equal(prizesReplicant.value, data.results)) {
          prizesReplicant.value = data.results;
          log.info(`prizes updated to ${JSON.stringify(data.results)}`);
        }
      })
      .catch((err) => {
        log.error('error getting prizes: ', err);
      });
    // prizesReplicant.value = [{endtime: 1570702210000, minDonation: 10, name: "Epic Tr1cks Mug", provider: "The Tr1cks", image: "https://www.bingothon.com/pictures/logo-winter.png"},
    // {endtime: undefined, minDonation: 200, name: "Something", provider: "Someone", image: "https://www.bingothon.com/pictures/logo.jpg"}];
  }
  doUpdate();
  setInterval(doUpdate, 30000);
} else {
  log.warn('not enabled!');
}
