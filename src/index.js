require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT

// Routes
const crypto = require('./routes/crypto');
const fiat = require('./routes/fiat');
app.use('/crypto', crypto);
app.use('/fiat', fiat);

//modules
const errorHandler = require('./modules/errors');
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

