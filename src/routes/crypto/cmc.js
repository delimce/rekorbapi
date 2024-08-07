const express = require('express');
let router = express.Router();
const cmc = require("../../modules/crypto/coinmarketcap");
const apicache = require('apicache');
let cache = apicache.middleware;
const logger = require('../../modules/app/logger');

// higher-order function returns false for responses of other status codes (e.g. 403, 404, 500, etc)
const onlyStatus200 = (req, res) => res.statusCode === 200
const cacheSuccesses = cache('5 minutes', onlyStatus200)


router.get('/cmc/all', cacheSuccesses, async function (req, res) {
  let info = await cmc.getAll();
  if (info && info.length > 1) {
    let final = await cmc.shortInfoCoins(info);
    res.json(final);
  } else {
    res.status(503);
    logger.error(`Error: invalid data from api cmc/all`);
    res.render('error', { error: "service not available" });
  }
});

router.get('/cmc/detail/:id', cacheSuccesses, async function (req, res) {
  let info = await cmc.getById(req.params.id);
  res.json(info);
});

module.exports = router;