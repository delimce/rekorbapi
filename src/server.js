require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.SERVER_PORT

//middlewares
const bodyParser = require("./middlewares/bodyParser.js");
app.use(bodyParser.parsers);

app.use(express.static('public'));

// Routes
const crypto = require('./routes/crypto/cmc');
const fiat = require('./routes/fiat');
const trades = require('./routes/crypto/localbtc');
const rekorbit = require('./routes/app');
app.use('/crypto', crypto);
app.use('/fiat', fiat);
app.use('/trades', trades);
app.use('/app', rekorbit);

//modules
const errorHandler = require('./middlewares/errors');
app.use(errorHandler);

module.exports = app;
