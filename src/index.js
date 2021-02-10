require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.SERVER_PORT

//middlewares
const bodyParser = require("./middlewares/bodyParser.js");
app.use(bodyParser.parsers);

// Routes
const crypto = require('./routes/crypto');
const fiat = require('./routes/fiat');
const trades = require('./routes/trades');
app.use('/crypto', crypto);
app.use('/fiat', fiat);
app.use('/trades', trades);

//modules
const errorHandler = require('./middlewares/errors');
app.use(errorHandler);


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

