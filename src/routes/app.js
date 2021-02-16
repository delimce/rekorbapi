const express = require('express');
let router = express.Router();

const apicache = require('apicache');
let cache = apicache.middleware;

const self = require("../modules/app/selfCalls");
const utils = require("../modules/app/utils");

router.post('/dashboard', async function (req, res) {

    let coins = await req.body;
     //multiple call
     const [coinMarketCap, dolartoday, floatrates] = await Promise.all([
      self.cmcAll(),
      self.dtodayInfo(),
      self.floatrates()
    ]);

    res.send(coinMarketCap);
  });

module.exports = router;