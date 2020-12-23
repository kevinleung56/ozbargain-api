'use strict';

const xray = require('x-ray');
// const cheerio = require('cheerio');
// const axios = require('axios').default;
const { DateTime } = require('luxon');

const x = new xray();
const OZBARGAIN_HOMEPAGE_DEALS_URL = 'https://www.ozbargain.com.au/';
const OZBARGAIN_DEALS_URL = 'https://www.ozbargain.com.au/deals/';
const OZBARGAIN_NODE_URL = 'https://www.ozbargain.com.au/node/';
const OZBARGAIN_FORUM_HOME_URL = 'https://www.ozbargain.com.au/forum/';

const DateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/;
const TimeRegex = /\d{1,2}:\d{1,2}/;
const ExpiredRegex = /\d{1,2}[\sa-zA-Z]{1,10}\d{1,2}:\d{1,2}([a-zA-Z]{2})?/;
const UpcomingDateTimeRegex = /((\d{1,2}\s[a-zA-Z]{3}(\s\d{1,2}:\d{1,2})?([a-zA-Z]{2})?)|\d{2})/;
const UpcomingDateRegex = /\d{1,2}\s[a-zA-Z]{3}/;

function fetchDeals() {
  return new Promise(function (resolve, reject) {
    x(OZBARGAIN_HOMEPAGE_DEALS_URL, '.node-ozbdeal', [
      {
        title: 'h2.title@data-title',
        link: 'h2.title a@href',
        meta: {
          submitted: x('div.submitted', {
            associated: 'span.storerep',
            author: 'strong',
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
            date: x('div.submitted'),
          }),
          image: 'img.gravatar@src',
          labels: ['div.messages ul li'],
          freebie: 'span.nodefreebie@text',
          expiryDate: '.links span.expired',
          upcoming: 'span.upcoming',
          upcomingDate: 'span.nodeexpiry',
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
          cleanDealObject(deal);
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
            author: '.name',
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

function cleanDealObject(dealObject) {
  let errors = [];
  dealObject.meta = parseDealMeta(dealObject.meta);

  if (dealObject.vote) {
    if (!dealObject.vote.up || isNaN(parseInt(dealObject.vote.up))) {
      dealObject.vote.up = '0';
    }

    if (!dealObject.vote.down || isNaN(parseInt(dealObject.vote.down))) {
      dealObject.vote.down = '0';
    }
  } else {
    dealObject.vote = {
      up: '0',
      down: '0',
    };
  }

  if (!dealObject.meta.submitted.author) {
    errors.push('Failed to parse author from ' + dealObject.meta.submitted);
  }

  if (!dealObject.meta.submitted.date) {
    errors.push('Failed to parse date from ' + dealObject.meta.submitted);
  }

  dealObject.errors = errors;
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

function fetchNode(nodeId) {
  // TODO
  return new Promise(function (resolve, reject) {
    x(OZBARGAIN_NODE_URL.concat(nodeId), '.main', {
      title: 'h1.title',
      meta: {
        submitted: {
          avatar: x('div.n-left', 'img.gravatar@src'),
          author: x('div.submitted', 'a'),
          date: x('div.submitted'),
        },
      },
      content: 'div.content',
    })
      // .paginate('a.pager-next@href')
      .then(function (data) {
        resolve(data);
      })
      .catch(function (e) {
        reject(e);
      });
  });
}

function fetchForum(forumId) {
  return new Promise(function (resolve, reject) {
    x(
      OZBARGAIN_FORUM_HOME_URL.concat(forumId),
      'tbody',
      x('tr', [
        {
          topic: x('span.title', 'a'),
          replies: {
            existing: 'td.replies',
            new: x('span.marker', 'a'), // TODO
          },
          created: x('td.created', {
            img: 'img@src',
            author: 'a',
            date: 'div',
          }),
          lastReply: x('td.last-reply', {
            img: 'img@src',
            author: 'a',
            date: 'div',
          }),
        },
      ])
    )
      // .paginate('a.pager-next@href')
      .then(function (data) {
        data.shift(); // remove first element since it's always empty
        resolve(data);
      })
      .catch(function (e) {
        reject(e);
      });
  });
}

function fetchLatestDeals() {
  return new Promise(function (resolve, reject) {
    x(OZBARGAIN_DEALS_URL, '.node-ozbdeal', [
      {
        title: 'h2.title@data-title',
        link: 'h2.title a@href',
        meta: {
          submitted: x('div.submitted', {
            associated: 'span.storerep',
            author: 'strong',
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

function parseDealMeta(meta) {
  let dateTimeUnix, upcomingDate, expiredDate;
  if (meta.submitted) {
    try {
      let rawDateTime = meta.submitted.date;
      let dateTime = rawDateTime.match(DateRegex)[0];
      dateTime += ` ${rawDateTime.match(TimeRegex)[0]}`;
      dateTimeUnix = DateTime.fromFormat(dateTime, 'dd/MM/yyyy T');
      dateTimeUnix = dateTimeUnix.isValid
        ? dateTimeUnix.toMillis()
        : dateTimeUnix.invalidReason; // note that upcoming date response will error message if error occurs
    } catch {
      console.log(
        `Issue with either lack of date/time or formatting of it: ${meta.submitted}`
      );
    }

    if (meta.expiryDate) {
      let expiryDate = meta.expiryDate.match(ExpiredRegex);
      if (expiryDate) {
        expiryDate = expiryDate[0].replace('pm', ' pm');
        expiryDate = expiryDate.replace('am', ' am');
        expiredDate = DateTime.fromFormat(expiryDate, 'dd MMM t');
        expiredDate = expiredDate.isValid
          ? expiredDate.toMillis()
          : expiredDate.invalidReason; // note that upcoming date response will error message if error occurs
      }
    }

    if (meta.upcoming && meta.upcomingDate) {
      let upcomingDealDates = parseUpcomingDealDates(meta.upcomingDate.trim());
      upcomingDate = upcomingDealDates.upcomingDate;

      if (upcomingDealDates.expiryDate) {
        expiredDate = upcomingDealDates.expiryDate;
      }
    }

    if (meta.freebie) {
      meta.freebie = meta.freebie.trim() === 'Freebie';
    }
  }

  meta.submitted.date = dateTimeUnix;
  meta.expiryDate = expiredDate;
  meta.upcomingDate = upcomingDate;

  return meta;
}

function parseUpcomingDealDates(upcoming) {
  let upcomingDate, expiryDate;
  let upcomingDates = upcoming.split('–');

  if (upcomingDates) {
    let upcomingMatch = upcomingDates[0].match(UpcomingDateTimeRegex);

    upcomingMatch = upcomingMatch
      ? upcomingMatch
      : upcomingDates[0].match(UpcomingDateRegex);

    if (upcomingMatch) {
      upcomingDate = upcomingMatch[0];
      let dateTime = DateTime.fromFormat(upcomingDate, 'd MMM h:mma');
      let date = DateTime.fromFormat(upcomingDate, 'd MMM');

      upcomingDate = dateTime.isValid
        ? dateTime.toMillis()
        : date.isValid
        ? date.toMillis()
        : date.invalidReason; // note that upcoming date response will error message if error occurs
    }

    if (upcomingDates.length > 1) {
      let expiryMatch = upcomingDates[1].match(UpcomingDateTimeRegex);

      expiryMatch = expiryMatch
        ? expiryMatch
        : upcomingDates[1].match(UpcomingDateRegex);

      if (expiryMatch) {
        let dateTime = DateTime.fromFormat(expiryMatch[0], 'd MMM h:mma');
        let date = DateTime.fromFormat(expiryMatch[0], 'd MMM');

        expiryDate = dateTime.isValid
          ? dateTime.toMillis()
          : date.isValid
          ? date.toMillis()
          : date.invalidReason; // note that upcoming date response will error message if error occurs
      }
    }
  }

  return { upcomingDate, expiryDate };
}

module.exports = {
  fetchDeals: fetchDeals,
  fetchForums: fetchForums,
  fetchDeal: fetchDeal,
  fetchForum: fetchForum,
  fetchLatestDeals: fetchLatestDeals,
  fetchNode: fetchNode,
};
