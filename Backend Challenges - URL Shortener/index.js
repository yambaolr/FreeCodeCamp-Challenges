// imports
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const dns = require("dns");
const urlParser = require("url");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// POST api
app.post('/api/shorturl', (req, res) => {
  const original = req.body.url;

  // verify if host is valid

  // shorturl counter
  
});

// GET api
app.get('/api/shorturl/:short', (req, res) => {
  
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
