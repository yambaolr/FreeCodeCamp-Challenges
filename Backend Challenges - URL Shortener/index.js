// imports
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
app.use(bodyParser.urlencoded({extended: false}));

let urlDb = {};
let counter = 1;

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// POST api
app.post('/api/shorturl', (req, res) => {
  const original = req.body.url;

  // verify if host is valid
  let hostname;
  try {
    hostname = urlParser.parse(original).hostname;
  } catch (err) {
    return res.json({error: "invalid url"});
  }

  if (!hostname) {
    return res.json({error: "invalid url"});
  }

  dns.lookup(hostname, (err) => {
    if(err) {
      return res.json({error: "invalid url"});
    }
  })

  // shorturl counter
  let short = counter++;
  urlDb[short] = original;
  res.json({original_url: original, short_url: short});
});

// GET api
app.get('/api/shorturl/:short', (req, res) => {
  const short = req.params.short;
  const original = urlDb[short];

  if(original) {
    res.redirect(original);
  } else{
    res.json({error: "No short URL found for given output"});
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
