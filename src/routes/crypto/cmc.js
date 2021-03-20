const express = require('express');
let router = express.Router();
const cmc = require("../../modules/crypto/coinmarketcap");
const apicache = require('apicache');
let cache = apicache.middleware;

// higher-order function returns false for responses of other status codes (e.g. 403, 404, 500, etc)
const onlyStatus200 = (req, res) => res.statusCode === 200
const cacheSuccesses = cache('5 minutes', onlyStatus200)


router.get('/cmc/all', cacheSuccesses, async function (req, res) {
  let info = await cmc.getAll();
  let final = await cmc.shorInfoCoins(info);
  if (final.length > 1) {
    res.json(final);
  } else {
    res.status(503);
    res.render('error', { error: "service not available" });
  }

});

router.get('/cmc/detail/:id', cacheSuccesses, async function (req, res) {
  let info = await cmc.getById(req.params.id);
  res.json(info);
});

module.exports = router;