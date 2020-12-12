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
