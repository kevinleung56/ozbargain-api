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

function fetchDeal(dealId) {
  return new Promise(function (resolve, reject) {
    try {
      x(OZBARGAIN_NODE_URL.concat(dealId), '.main', {
        id: dealId,
        title: 'h1#title@data-title',
        meta: {
          submitted: 'div.submitted',
          image: 'img.gravatar@src',
          labels: ['div.messages ul li'],
          freebie: 'span.nodefreebie@text',
          expired: '.links span.expired',
          upcoming: '.links span.inactive',
        },
        description: 'div.content@html',
        vote: {
          up: 'span.voteup',
          down: 'span.votedown',
        },

        snapshot: {
          link: '.foxshot-container a@href',
          title: '.foxshot-container a@title',
          image: '.foxshot-container img@src',
        },
        category: 'ul.links span.tag a',
        tags: ['.taxonomy span'],
      })
        .then(function (deal) {
          let errors = [];
          let content = parseDealDescription(deal.description);
          if (!content || content.length < 2) {
            errors.push('Failed to parse content from description');
          }
          deal.content = content;
          deal.meta = parseDealMeta(deal.meta);

          if (deal.vote) {
            try {
              if (!deal.vote.up) {
                deal.vote.up = '0';
              }
              var upVote = parseInt(deal.vote.up);
              if (isNaN(upVote)) {
                deal.vote.up = '0';
              }
            } catch (e) {
              deal.vote.up = '0';
            }

            try {
              if (!deal.vote.down) {
                deal.vote.down = '0';
              }
              var downVote = parseInt(deal.vote.down);
              if (isNaN(downVote)) {
                deal.vote.down = '0';
              }
            } catch (e) {
              deal.vote.down = '0';
            }
          } else {
            deal.vote = {
              up: '0',
              down: '0',
            };
          }

          let meta = deal.meta;

          if (!meta.author || meta.author.length < 2) {
            errors.push('Failed to parse author from ' + meta.submitted);
          }
          if (!meta.date || meta.date.length < 16 || meta.date.length > 20) {
            errors.push('Failed to parse date from ' + meta.submitted);
          }
          if (!meta.timestamp || meta.timestamp.length < 8) {
            errors.push('Failed to parse timestamp from ' + meta.submitted);
          }

          deal.snapshot = parseDealSnapshot(deal.snapshot);

          if (!deal.snapshot.goto || deal.snapshot.goto.length < 5) {
            errors.push('Failed to parse snapshot from ' + snapshot.title);
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

function fetchForums() {}

function fetchForum(forumId) {}

function fetchLiveDeals() {}

function parseDealDescription(description) {
  let html = '';
  try {
    if (!description) {
      return html;
    }
    let $ = cheerio.load(description);
    let childs = $('body').children();

    let truncateLen = 165;
    let htmlLen = 0;
    if (childs.length > 0) {
      let child1 = $(childs[0]);
      let child1Text = child1.text();

      if (child1Text.length > truncateLen) {
        child1.text(child1Text.substring(0, truncateLen) + ' ...');
      }

      htmlLen = child1.text().length;

      html += $.html(childs[0]) + '\n';
    }
    if (htmlLen < truncateLen && childs.length > 1) {
      let child2 = $(childs[1]);
      let child2Text = child2.text();
      let diffLen = truncateLen - htmlLen;
      if (child2Text.length > diffLen) {
        child2.text(child2Text.substring(0, diffLen));
      }

      child2.text(child2.text() + '...');
      html += $.html(childs[1]) + '\n';
    }
    let text = cheerio.load(html).text();
    return text;
  } catch (e) {
    logError('An error occurred while parsing description ', e, description);

    return '';
  }
}

function parseDealMeta(meta) {
  let author, submitDate, timestamp, expiredDate, upcomingDate;
  if (meta.submitted) {
    author = meta.submitted.split(' on ')[0];

    let dateMatch = meta.submitted.match(DateRegex);
    if (dateMatch.length > 0) {
      submitDate = dateMatch[0];
      let timeMatch = meta.submitted.match(TimeRegex);
      if (timeMatch.length > 0) {
        submitDate += ' ';
        submitDate += timeMatch[0];
      }
    }

    if (submitDate && submitDate.length > 0) {
      timestamp = DateTime.fromFormat(submitDate, 'dd/MM/yyyy T').toMillis();
    }

    let expired = meta.expired;
    if (expired) {
      let expiredMatch = expired.match(ExpiredRegex);
      if (expiredMatch && expiredMatch.length > 0) {
        expiredDate = DateTime.fromFormat(
          expiredMatch[0],
          'dd MMM t'
        ).toMillis();
      }
    }

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

  meta.author = author || '';
  meta.date = submitDate || '';
  meta.timestamp = timestamp || 0;
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

function parseDealSnapshot(snapshot) {
  let goto = '';

  if (snapshot.title) {
    goto = snapshot.title.replace('Go to ', '');
  }

  snapshot.goto = goto;
  return snapshot;
}

module.exports = {
  fetchDeals: fetchDeals,
  fetchForums: fetchForums,
  fetchDeal: fetchDeal,
  fetchForum: fetchForum,
  fetchLiveDeals: fetchLiveDeals,
};
