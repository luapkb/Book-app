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
  console.log('req: '+req);
  console.log('req.body: '+req.body);
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

//////////////////////////////////////////////////////////////////////
//Book Constructor
function Book(data){
  const bookImg = 'http://placeholder.it/300x300';
  this.title = data.volumeInfo.title || 'No book available';
  this.author = data.volumeInfo.authors || 'No Author Listed';
  this.publisher = data.publisher || 'No book available';
  this.publishedDate = data.publishedDate || 'No book available';
  this.description = data.description || 'No book available';
  this.etag = data.etag;
}

function errorHandler(error, req, res) {
  res.status(500).send(error);
}
