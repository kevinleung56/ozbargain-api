'use strict';

const xray = require('x-ray');
const cheerio = require('cheerio');
const axios = require('axios').default;
const { DateTime } = require('luxon');

const x = new xray();
const OZBARGAIN_DEALS_URL = 'https://www.ozbargain.com.au/deals';
const OZBARGAIN_NODE_URL = 'https://www.ozbargain.com.au/node/';
const OZBARGAIN_FORUM_HOME_URL = 'https://www.ozbargain.com.au/forum';
const OZBARGAIN_LIVE_DEALS_URL = 'https://www.ozbargain.com.au/forum';

// const Action_VoteUp = 'Vote Up';
// const Action_VoteDown = 'Vote Down';
// const Action_Post = 'Post';
// const liveActions = [Action_Post, Action_VoteUp, Action_VoteDown];
const DateFormat = 'DD/MM/YYYY hh:mm';
const TimeZone = 'Australia/Melbourne';

const DateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/;
const TimeRegex = /\d{1,2}\:\d{1,2}/;
const ExpiredRegex = /\d{1,2}[\sa-zA-Z]{1,10}\d{1,2}\:\d{1,2}([a-zA-Z]{2})?/;
const UpcomingRegex = /((\d{1,2}\s[a-zA-Z]{3}(\s\d{1,2}\:\d{1,2})?([a-zA-Z]{2})?)|\d{2})/;

function fetchDeals() {
  return new Promise(function (resolve, reject) {
    x(OZBARGAIN_DEALS_URL, '.node-ozbdeal', [
      {
        title: 'h2.title@data-title',
        link: 'h2.title a@href',
        meta: {
          submitted: x('div.submitted', {
            associated: 'span.storerep',
            username: 'strong',
            thirdParty: 'span.referrer',
          }),
          image: 'img.gravatar@src',
        },
        coupon: 'div.couponcode',
        description: x('.node-ozbdeal', ['p']),
        vote: {
          up: 'span.voteup',
          down: 'span.votedown',
        },
        gravatar: 'img.gravatar@src',
        snapshot: {
          link: '.foxshot-container a@href',
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

function fetchDeal(dealId) {
  return new Promise(function (resolve, reject) {
    try {
      x(OZBARGAIN_NODE_URL.concat(dealId), '.main', {
        id: dealId,
        title: 'h1#title@data-title',
        meta: {
          submitted: x('div.submitted', {
            associated: 'span.storerep',
            author: 'strong',
            thirdParty: 'span.referrer',
            // date: - need to add date from page here
          }),
          image: 'img.gravatar@src',
          labels: ['div.messages ul li'],
          freebie: 'span.nodefreebie@text',
          expired: '.links span.expired',
          upcoming: '.links span.inactive',
        },
        coupon: 'div.couponcode',
        description: x('.node-ozbdeal', ['p']),
        vote: {
          up: 'span.voteup',
          down: 'span.votedown',
        },
        snapshot: {
          link: '.foxshot-container a@href',
          image: '.foxshot-container img@src',
        },
        category: 'ul.links span.tag a',
        tags: ['.taxonomy span'],
      })
        .then(function (deal) {
          let errors = [];
          deal.meta = parseDealMeta(deal.meta);

          if (deal.vote) {
            if (!deal.vote.up || isNaN(parseInt(deal.vote.up))) {
              deal.vote.up = '0';
            }

            if (!deal.vote.down || isNaN(parseInt(deal.vote.down))) {
              deal.vote.down = '0';
            }
          } else {
            deal.vote = {
              up: '0',
              down: '0',
            };
          }

          if (!deal.meta.submitted.author) {
            errors.push('Failed to parse author from ' + deal.meta.submitted);
          }
          if (
            !deal.meta.date ||
            deal.meta.date.length < 16 ||
            deal.meta.date.length > 20
          ) {
            errors.push('Failed to parse date from ' + deal.meta.submitted);
          }
          if (!deal.meta.timestamp || deal.meta.timestamp.length < 8) {
            errors.push(
              'Failed to parse timestamp from ' + deal.meta.submitted
            );
          }

          deal.errors = errors;
          resolve(deal);
        })
        .catch(function (e) {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
}

function fetchForums() {
  return new Promise(function (resolve, reject) {
    x(
      OZBARGAIN_FORUM_HOME_URL,
      'tbody',
      x('tr', [
        {
          forumType: x('.container', '.name'),
          forum: x('.forum', {
            name: '.name',
            description: '.description',
          }),
        },
      ])
    )
      .then(function (data) {
        data.map((forumObject) => {
          cleanForumObject(forumObject, data);
        });

        resolve(data);
      })
      .catch(function (e) {
        reject(e);
      });
  });
}

function cleanForumObject(forumObject, arr) {
  if (forumObject.forum && Object.keys(forumObject.forum).length === 0) {
    delete forumObject.forum;
  }
  if (Object.keys(forumObject).length === 0) {
    let index = arr.indexOf(forumObject);
    arr.splice(index, 1);
    cleanForumObject(arr[arr.indexOf(forumObject) + 1], arr);
  }
}

function fetchForum(forumId) {}

function fetchLiveDeals() {}

function parseDealMeta(meta) {
  let submitDate, timestamp, expiredDate, upcomingDate;
  if (meta.submitted) {
    // let dateMatch = meta.submitted.match(DateRegex);
    // if (dateMatch.length > 0) {
    //   submitDate = dateMatch[0];
    //   let timeMatch = meta.submitted.match(TimeRegex);
    //   if (timeMatch.length > 0) {
    //     submitDate += ' ';
    //     submitDate += timeMatch[0];
    //   }
    // }

    // if (submitDate && submitDate.length > 0) {
    //   timestamp = DateTime.fromFormat(submitDate, 'dd/MM/yyyy T').toMillis();
    // }

    // let expired = meta.expired;
    // if (expired) {
    //   let expiredMatch = expired.match(ExpiredRegex);
    //   if (expiredMatch && expiredMatch.length > 0) {
    //     expiredDate = DateTime.fromFormat(
    //       expiredMatch[0],
    //       'dd MMM t'
    //     ).toMillis();
    //   }
    // }

    if (meta.upcoming) {
      let upcomingDates = parseDealUpcomingDates(meta.upcoming);
      upcomingDate = upcomingDates.upcoming;
      if (upcomingDates.expiry) {
        expiredDate = upcomingDates.expiry;
      }
    }

    if (meta.freebie) {
      meta.freebie = meta.freebie.trim();
    } else {
      meta.freebie = '';
    }

    if (!meta.labels) {
      meta.labels = [];
    }
  }

  // meta.date = submitDate || '';
  // meta.timestamp = timestamp || 0;
  meta.expiredDate = expiredDate || 0;
  meta.upcomingDate = upcomingDate || 0;

  return meta;
}

function parseDealUpcomingDates(upcoming) {
  let dates = {
    upcoming: 0,
    expiry: 0,
  };
  let upcomingDate, expiryDate;
  let upcomings = upcoming.split('–');
  if (upcomings.length > 0) {
    let upcomingText = upcomings[0];
    let upcomingMatch = upcomingText.match(UpcomingRegex);
    if (upcomingMatch && upcomingMatch.length > 0) {
      upcomingDate = upcomingMatch[0];
    }
    if (upcomings.length > 1) {
      let expiryText = upcomings[1];
      let expiryMatch = expiryText.match(UpcomingRegex);
      if (expiryMatch && expiryMatch.length > 0) {
        expiryDate = expiryMatch[0];
      }
    }

    let exp, upcom;

    if (expiryDate) {
      exp = DateTime.fromFormat(expiryDate, 'dd MMM h:mma').toMillis();
      dates.expiry = exp;
    }

    if (upcomingDate) {
      upcom = DateTime.fromFormat(upcomingDate, 'dd MMM h:mma');
      if (upcomingDate.replace(' ', '').length == 2) {
        if (exp) {
          upcom.set({ month: exp.get('M') });
        }
      }
      dates.upcoming = upcom.toMillis();
    }
  }

  return dates;
}

module.exports = {
  fetchDeals: fetchDeals,
  fetchForums: fetchForums,
  fetchDeal: fetchDeal,
  fetchForum: fetchForum,
  fetchLiveDeals: fetchLiveDeals,
};
