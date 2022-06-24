const express = require('express');
let router = express.Router();
const gecko = require("../../modules/crypto/coingecko");
const apicache = require('apicache');
let cache = apicache.middleware;
const logger = require('../../modules/app/logger');

// higher-order function returns false for responses of other status codes (e.g. 403, 404, 500, etc)
const onlyStatus200 = (req, res) => res.statusCode === 200
const cacheSuccesses = cache('5 minutes', onlyStatus200)

router.get('/gecko/ping', async function (req, res) {
    let ping = await gecko.ping()
    res.json(ping);
});

router.get('/gecko/list', cacheSuccesses, async function (req, res) {
    let list = await gecko.getMarkets()
    res.json(list);
});

router.get('/gecko/prices', async function (req, res) {
    let coins = await req.body;
    if (!coins.length) {
        res.status(400);
        logger.error(`Error: invalid data from api gecko/prices`);
        res.json({ "error": "not coins found" });
        return false;
    }
    let list = await gecko.getPricesByIds(coins)
    res.json(list);

});

module.exports = router;