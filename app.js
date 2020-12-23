'use strict';

const express = require('express');
const scraper = require('./scraper');
const showdown = require('showdown');
const app = express();

// Routes
app.get('/', async (req, res) => {
  let converter = new showdown.Converter({ tables: true });
  // converter.setFlavor('github');
  // let tableMarkdown =
  //   '|     |    GET   |   POST   |   h4   |\n' +
  //   '|:------|:-------:|:-------:|-------:|\n' +
  //   '| 100   | [a][1]  | ![b][2] |\n' +
  //   '| *foo* | **bar** | ~~baz~~ |';
  let markdown =
    '# Welcome to the Ozbargain API!\n' +
    // '##The following is the API documentation\n' +
    '### Hope you enjoy :)\n' +
    '#### - Kevin\n';
  // tableMarkdown;
  let html = converter.makeHtml(markdown);
  res.status(200).send(html);
});

app.get('/deals', async (req, res) => {
  const deals = await scraper.fetchDeals();
  if (deals) {
    res.status(200).json(deals);
  } else {
    console.log(`Something is wrong with deals object: ${deals}`);
    res.status(503).send('Something went wrong. Try again later');
  }
});

app.get('/deals/live', async (req, res) => {
  const deals = await scraper.fetchLatestDeals();
  if (deals) {
    res.status(200).json(deals);
  } else {
    console.log(`Something is wrong with deals object: ${deals}`);
    res.status(503).send('Something went wrong. Try again later');
  }
});

app.get('/deal/:dealId', async (req, res) => {
  if (req.params.dealId) {
    const deal = await scraper.fetchDeal(req.params.dealId);

    // if (req.query && req.query.comments) {
    //   deal = await scraper.fetchDeal(req.params.dealId);
    // } else {
    //   deal = await scraper.fetchDeal(req.params.dealId);
    // }

    if (deal) {
      res.status(200).json(deal);
    } else {
      console.log(`Something is wrong with deal object: ${deal}`);
      res
        .status(503)
        .send('Either no such deal exists or something went wrong on our end.');
    }
  } else {
    res.status(400).send('No deal ID provided');
  }
});

app.get('/forums', async (req, res) => {
  const forums = await scraper.fetchForums();
  if (forums) {
    res.status(200).json(forums);
  } else {
    console.log(`Something is wrong with forums object: ${forums}`);
    res.status(503).send('Something went wrong. Try again later');
  }
});

app.get('/forum/:forumId', async (req, res) => {
  let forumId = req.params.forumId;
  if (forumId) {
    const forum = await scraper.fetchForum(forumId);
    if (forum) {
      res.status(200).json(forum);
    } else {
      console.log(`Something is wrong with forum object: ${forum}`);
      res
        .status(503)
        .send(
          'Either no such forum topic exists or something went wrong on our end.'
        );
    }
  } else {
    res.status(400).send('No forum ID provided');
  }
});

app.get('/node/:nodeId', async (req, res) => {
  let nodeId = req.params.nodeId;
  if (nodeId) {
    const node = await scraper.fetchNode(nodeId);
    if (node) {
      res.status(200).json(node);
    } else {
      console.log(`Something is wrong with node object: ${node}`);
      res
        .status(503)
        .send(
          'Either no such node topic exists or something went wrong on our end.'
        );
    }
  } else {
    res.status(400).send('No node ID provided');
  }
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(500).send('Internal Serverless Error');
  }
});

// DEBUG
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
