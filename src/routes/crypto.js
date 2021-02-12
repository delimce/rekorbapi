const express = require('express');
let router = express.Router();
const cmc = require("../modules/coinmarketcap");
const apicache = require('apicache');
let cache = apicache.middleware;


router.get('/cmc/all', cache('5 minutes'), async function (req, res) {
  let info = await cmc.getAll();
  let final = await cmc.shorInfoCoins(info)
  res.json(final);
});

router.get('/cmc/detail/:id', cache('5 minutes'), async function (req, res) {
  let info = await cmc.getById(req.params.id);
  res.json(info);
});

module.exports = router;