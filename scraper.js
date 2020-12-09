'use strict';

const cheerio = require('cheerio');
const axios = require('axios').default;
const OZBARGAIN_FEED_URL = 'https://www.ozbargain.com.au/deals';

async function fetchDeals() {
  return await axios.get(OZBARGAIN_FEED_URL).then(function (response) {
    const $ = cheerio.load(response.data);
    let deals = [];
    $('.node-ozbdeal').map((i, el) => {
      const dealExpired = $(el).find($('span.expired')).text();
      if (
        !dealExpired.includes('expired') &&
        !dealExpired.includes('out of stock')
      ) {
        const id = $(el).find($('h2.title')).find('a').attr('href').substr(6);
        const title = $(el).find($('h2.title')).find('a').text();
        const upvotes = $(el).find($('span.voteup')).children().last().text();
        const downvotes = $(el)
          .find($('span.votedown'))
          .children()
          .last()
          .text();
        const time_posted = $(el)
          .find($('div.submitted'))
          .contents()
          .filter((i, child) => child.type === 'text')
          .text()
          .substring(4, 22);
        const deal = {
          id: id,
          title: title,
          upvotes: upvotes,
          downvotes: downvotes,
          time_posted: time_posted,
        };
        deals.push(deal);
      }
    });
    return deals;
  });
}

module.exports = {
  fetchDeals: fetchDeals,
};
