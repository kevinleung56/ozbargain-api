'use strict';

const fs = require('fs');
const express = require('express');
const scraper = require('./scraper');
const showdown = require('showdown');
const app = express();

// Routes
app.get('/', async (req, res) => {
  fs.readFile('./openapi.md', 'utf8', (err, data) => {
    if (!err) {
      let converter = new showdown.Converter();
      let markdown =
        '# Welcome to the Ozbargain API!\n' +
        '##The following is the API documentation (best seen on GitHub) \n' +
        '### Hope you enjoy :)\n' +
        '#### - Kevin\n\n';
      markdown += data;
      let html = converter.makeHtml(markdown);
      res.status(200).send(html);
    } else {
      console.log(err);
      res.status(500).send('Something went wrong on our end.');
    }
  });
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
    let deal;

    if (req.query && req.query.comments) {
      deal = await scraper.fetchDealWithComments(req.params.dealId);
    } else {
      deal = await scraper.fetchDeal(req.params.dealId);
    }

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
  if (req.params.forumId) {
    const forum = await scraper.fetchForum(req.params.forumId);
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
  if (req.params.nodeId) {
    let node;

    if (req.query && req.query.comments) {
      node = await scraper.fetchNodeWithComments(req.params.nodeId);
    } else {
      node = await scraper.fetchNode(req.params.nodeId);
    }

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
app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(500).send('Internal Serverless Error');
  }
});

// DEBUG
// const port = 3000;

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

module.exports = app;
