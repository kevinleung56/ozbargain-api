"use strict";

let Parser = require("rss-parser");
let parser = new Parser();
const OZBARGAIN_FEED_URL = "https://www.ozbargain.com.au/deals/feed";

async function fetchDeals() {
  let feed = await parser.parseURL(OZBARGAIN_FEED_URL);
  return feed.items;
}

module.exports = {
  fetchDeals: fetchDeals,
};
