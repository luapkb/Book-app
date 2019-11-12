'use strict'

const express = requier('express');
const superagent = requier('superagent');
const Cors =requier('cors'); 
requier('dotenv').config();

const PORT = process.env.PORT || 3002;
const app = express();
app.use(cors());
app.use(express.static('./public'));

app.get('/', openSearch);
app.get('/searches'searchForBooks);

function openSeach(req, res) {
  res.render('pages/index');
}

function searchForBooks(req,res)
app.listen(PORT, () => console.log('listening'));