'use strict';

// eslint-disable-next-line import/no-unresolved
const express = require('express');
const scraper = require('./scraper');

const app = express();

// Routes
app.get('/', async (req, res) => {
  res.send(`Request received: ${req.method} - ${req.path}`);
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

app.get('/deal/:dealId', async (req, res) => {
  if (req.params.dealId) {
    const deal = await scraper.fetchDeal(req.params.dealId);
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
    const deal = await scraper.fetchForum();
    if (deal) {
      res.status(200).json(deal);
    } else {
      console.log(`Something is wrong with forum object: ${deal}`);
      res
        .status(503)
        .send(
          'Either no such forum topic exists or something went wrong on our end.'
        );
    }
  } else {
    res.status(400).send('No deal ID provided');
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
