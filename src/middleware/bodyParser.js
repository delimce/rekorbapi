'use strict';
const bodyParser = require('body-parser');

let parsers = [];
// create application/json parser
let jsonParser = bodyParser.json()
parsers.push(jsonParser)

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })
parsers.push(urlencodedParser)

exports.parsers = parsers;

