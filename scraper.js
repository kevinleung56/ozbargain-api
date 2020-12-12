'use strict';

const xray = require('x-ray');
const cheerio = require('cheerio');
const axios = require('axios').default;

const x = new xray();
const OZBARGAIN_FEED_URL = 'https://www.ozbargain.com.au/deals';

function fetchDeals() {
  return new Promise(function (resolve, reject) {
    x(OZBARGAIN_FEED_URL, '.node-ozbdeal', [
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

module.exports = {
  fetchDeals: fetchDeals,
};
