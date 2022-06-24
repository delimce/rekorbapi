'use strict'
const express = require('express');
const lbtcRobot = require('../modules/robots/lbtcRobot');
const fiatPriceRobot = require('../modules/robots/fiatPricesRobot');
const logger = require('../modules/app/logger');
let router = express.Router();

router.get('/localbtc/posts', async function (req, res) {
        try {
                let result = await lbtcRobot.findPosts();
                res.json(result);
        } catch (err) {
                logger.error(err);
                res.status(500);
                res.send(err)
        }
});

router.get('/fiat/prices', async function (req, res) {
        try {
                let result = await fiatPriceRobot.setFiatPrices();
                res.json(result);
        } catch (err) {
                logger.error(err);
                res.status(500);
                res.send(err)
        }
});

module.exports = router;