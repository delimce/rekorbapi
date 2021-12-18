require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.SERVER_PORT || 8080;

//middleware
const bodyParser = require("./middleware/bodyParser.js");
app.use(bodyParser.parsers);

app.use(express.static('public'));

//database
const mongodb = require("./middleware/database");
mongodb.connect()

// Routes
const cmc = require('./routes/crypto/cmc');
const gecko = require('./routes/crypto/gecko');
const fiat = require('./routes/fiat');
const trades = require('./routes/crypto/localbtc');
const rekorbit = require('./routes/app');
const users = require('./routes/users');
const robots = require('./routes/robots');

app.use('/crypto', [cmc,gecko]);
app.use('/fiat', fiat);
app.use('/trades', trades);
app.use('/app', rekorbit);
app.use('/users', users);
app.use('/robots', robots);

//modules
const errorHandler = require('./middleware/errors');
app.use(errorHandler);

module.exports = app;
