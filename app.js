"use strict";

// eslint-disable-next-line import/no-unresolved
const express = require("express");
const parser = require("./parser");

const app = express();

// Routes
app.get("/", (req, res) => {
  res.send(`Request received: ${req.method} - ${req.path}`);
});

app.get("/deals/", async (req, res) => {
  let deals = await parser.fetchDeals();
  res.send(
    `Here are the deals you ordered (amount = ${
      deals.length
    }): ${deals.map((i) => JSON.stringify(i))}`
  );
});

// Error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(500).send("Internal Serverless Error");
});

module.exports = app;
