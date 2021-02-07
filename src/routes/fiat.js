const express = require('express');
const dtoday = require("../modules/dolarToday");
const dmonitor = require("../modules/dolarMonitor");
const floatrates = require("../modules/floatrates");
let router = express.Router();

router.get('/dtoday', async function (req, res) {
    let info = await dtoday.getUsdPrice()
    res.json(info);
});

router.get('/dtoday/info', async function (req, res) {
    let info = await dtoday.getInfo()
    res.json(info);
});

router.get('/dmonitor', async function (req, res) {
    let info = await dmonitor.getUsdPrice()
    res.json(info);
});

router.get('/floatrates', async function (req, res) {
    let info = await floatrates.getInfoFiats()
    res.json(info);
});

module.exports = router;