'use strict'

// Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
app.use(cors());

app.use(express.static('./public'))
const PORT = process.env.PORT || 3000;

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// Routes
app.get('/', openSearch);

app.get('/searches', searchForBooks);

function openSearch(req, res){
  res.status(200).send('Hello');
}

function searchForBooks(req, res){
  res.status(200).send('searched');
}

