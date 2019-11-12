'use strict'

const express = requier('express');
const superagent = requier('superagent');
const Cors =requier('cors'); 
requier('dotenv').config();

const PORT = process.env.PORT || 3002;
const app = express();
app.use(cors());

app.get('/', openSearch);
app.get('/searches'searchForBooks);
app.listen(PORT, () => console.log('listening'));