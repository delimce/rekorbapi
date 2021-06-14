const express = require('express');
const dtoday = require("../modules/fiat/dolarToday");
const dmonitor = require("../modules/fiat/dolarMonitor");
const bcv = require("../modules/fiat/bcv");
const floatrates = require("../modules/fiat/floatrates");
const bluelytics = require("../modules/fiat/bluelytics");
let router = express.Router();
const apicache = require('apicache');
let cache = apicache.middleware;

// higher-order function returns false for responses of other status codes (e.g. 403, 404, 500, etc)
const onlyStatus200 = (req, res) => res.statusCode === 200;
const isPriceNotZero = (price) => Number(price) > 0;
const errorHandler = (price, res) => {
    if (isPriceNotZero(price)) {
        res.json(price);
    } else {
        res.status(500);
        res.json({ "error": "invalid price" });
    }
}
const cacheSuccesses = cache('45 minutes', onlyStatus200);

router.get('/dtoday/info', cacheSuccesses, async function (req, res) {
    let info = await dtoday.getInfo()
    res.json(info);
});

router.get('/dtoday/:name', cacheSuccesses, async function (req, res) {
    let id = await dtoday.getIdByCurrencyName(req.params.name);
    let info = await dtoday.getById(id);
    if (!info) {
        res.status(400);
        res.json({ "error": "not found" });
    } else {
        res.json(info);
    }
});


router.get('/dtoday', cacheSuccesses, async function (req, res) {
    let info = await dtoday.getUsdPrice();
    errorHandler(info, res);
});

router.get('/dmonitor', cacheSuccesses, async function (req, res) {
    let info = await dmonitor.getUsdPrice()
    errorHandler(info, res);
});

router.get('/bcv', cacheSuccesses, async function (req, res) {
    let info = await bcv.getUsdPrice()
    errorHandler(info, res);
});

router.get('/floatrates', cache('120 minutes'), async function (req, res) {
    let info = await floatrates.getInfoFiats()
    res.json(info);
});

/**
 * Arg currency
 */
router.get('/bluelytics', cache('120 minutes'), async function (req, res) {
    let info = await bluelytics.getInfoArg()
    res.json(info);
});

/**
 * high availability dollar to ves price
 */
router.get('/ve/ha/price', cacheSuccesses, async function (req, res) {
    let priority = [
        dmonitor,
        dtoday,
        bcv
    ]
    let usdPrice = 0.0;
    let i = 0;
    // sorry, i did not want to use WHILE but i had to :(
    while (i < priority.length) {
        try {
            usdPrice = await priority[i].getUsdPrice();
            if (Number(usdPrice) > 0) {
                break;
            }
            i++;
        } catch (err) {
            continue;
        }
    }
    errorHandler(usdPrice, res);
});

module.exports = router;