'use strict';

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

app.use(express.static('./public'));
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// Routes
app.get('/', openSearch);
app.post('/searches', searchForBooks);

function openSearch(req, res){
  res.render('pages/index');
}

function searchForBooks(req, res){
  console.log(req.body);
  const booksSearched = req.body.search[0];
  const typeOfSearch = req.body.search[1];
  let url =  `https://www.googleapis.com/books/v1/volumes?q=`;

  if (typeOfSearch === 'title') {
    url += `+intitle:${booksSearched}`;
  }
  if (typeOfSearch === 'author'){
    url += `inauthor:${booksSearched}`;
  }
  superagent.get(url)
    .then(results => {
      console.log('results retuned', results);
    })
    .catch(error => errorHandler(error, req, res));
}

app.post('/contact', (request, response) => {
  console.log(request.body);
  response.render('pages/index.ejs');
});

function errorHandler(error, req, res) {
  res.status(500).send(error);
}
