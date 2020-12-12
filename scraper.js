'use strict';

const xray = require('x-ray');
const cheerio = require('cheerio');
const axios = require('axios').default;

const x = new xray();
const OZBARGAIN_DEALS_URL = 'https://www.ozbargain.com.au/deals';
const OZBARGAIN_FORUM_HOME_URL = 'https://www.ozbargain.com.au/forum';
const OZBARGAIN_LIVE_DEALS_URL = 'https://www.ozbargain.com.au/forum';

function fetchDeals() {
  return new Promise(function (resolve, reject) {
    x(OZBARGAIN_DEALS_URL, '.node-ozbdeal', [
      {
        title: 'h2.title@data-title',
        link: 'h2.title a@href',
        meta: {
          submitted: 'div.submitted',
          image: 'img.gravatar@src',
        },
        content: 'div.content@html',
        vote: {
          up: 'span.voteup',
          down: 'span.votedown',
        },
        gravatar: 'img.gravatar@src',

        snapshot: {
          link: '.foxshot-container a@href',
          title: '.foxshot-container a@title',
          image: '.foxshot-container img@src',
        },
        category: 'ul.links span.tag a',
      },
    ])
      .paginate('a.pager-next@href')
      .then(function (data) {
        resolve(data);
      })
      .catch(function (e) {
        reject(e);
      });
  });
}

function fetchDeal(dealId) {}

function fetchForums() {}

function fetchForum(forumId) {}

function fetchLiveDeals() {}

module.exports = {
  fetchDeals: fetchDeals,
  fetchForums: fetchForums,
  fetchDeal: fetchDeal,
  fetchForum: fetchForum,
  fetchLiveDeals: fetchLiveDeals,
};
