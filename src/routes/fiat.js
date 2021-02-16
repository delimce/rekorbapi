const express = require('express');
const dtoday = require("../modules/fiat/dolarToday");
const dmonitor = require("../modules/fiat/dolarMonitor");
const floatrates = require("../modules/fiat/floatrates");
const bluelytics = require("../modules/fiat/bluelytics");
let router = express.Router();
const apicache = require('apicache');
let cache = apicache.middleware;

router.get('/dtoday', async function (req, res) {
    let info = await dtoday.getUsdPrice()
    res.json(info);
});

router.get('/dtoday/info', cache('45 minutes'), async function (req, res) {
    let info = await dtoday.getInfo()
    res.json(info);
});

router.get('/dtoday/:id', cache('45 minutes'), async function (req, res) {
    let id = req.params.id;
    let info = await dtoday.getById(id.toUpperCase());
    if (!info) {
        res.status(400);
        res.json({ "error": "not found" });
    } else {
        res.json(info);
    }
});

router.get('/dmonitor', cache('45 minutes'), async function (req, res) {
    let info = await dmonitor.getUsdPrice()
    res.json(info);
});

router.get('/floatrates', cache('60 minutes'), async function (req, res) {
    let info = await floatrates.getInfoFiats()
    res.json(info);
});

/**
 * Arg currency
 */
router.get('/bluelytics', cache('60 minutes'), async function (req, res) {
    let info = await bluelytics.getInfoArg()
    res.json(info);
});

module.exports = router;