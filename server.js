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

app.use(express.urlencoded({extended:true}));
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
app.get('/', homePage);
app.get('/search', openSearch)
app.post('/searches', searchForBooks);
app.use('*', notFound);
app.use(errorHandler);

// total: results.rows.pop()
///////////////////////////////////////////////////////////////////////
//HomePage
function homePage(req, res){
  let SQL = `SELECT * FROM books;`;
  client.query(SQL).then(results => {
    console.log(results.rows);
    res.render('pages/index', { bookInst:  results.rows});
  })
}
///////////////////////////////////////////////////////////////////////
//Open the search page
function openSearch(req, res){
  res.render('pages/searches/new');
}
///////////////////////////////////////////////////////////////////////
//Not Found
function notFound(req, res) {
  res.status(404).send('Not Found');
}
///////////////////////////////////////////////////////////////////////
//Error Handler
function errorHandler(error, req, res) {
  console.error(error);
  res.status(500).render('pages/error');
}


//USER FORM EVENT HANDLER/////////////////////////////////////////

function searchForBooks(req, res){
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
      console.log(results.body);
      let resArr = results.body.items.map(value => {
        return new Book(value)
      })
      // res.status(200).send(resArr); --functional
      res.status(200).render('pages/searches/show', { results: resArr });
    }).catch(error => errorHandler(error, req, res));
}

app.post('/contact', (request, response) => {
  console.log(request.body);
  response.render('pages/index.ejs');
});

//////////////////////////////////////////////////////////////////////
//Book Constructor
function Book(data){
  this.bookImg = `https://books.google.com/books/content?id=${data.id}&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api`
  this.title = data.volumeInfo.title;
  this.author = data.volumeInfo.authors;
  this.description = data.volumeInfo.description;
  this.ISBN = data.volumeInfo.industryIdentifiers[0].identifier;
}

