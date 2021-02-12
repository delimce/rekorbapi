const express = require('express');
const dtoday = require("../modules/dolarToday");
const dmonitor = require("../modules/dolarMonitor");
const floatrates = require("../modules/floatrates");
let router = express.Router();
const apicache = require('apicache');
let cache = apicache.middleware;

router.get('/dtoday', async function (req, res) {
    let info = await dtoday.getUsdPrice()
    res.json(info);
});

router.get('/dtoday/info', async function (req, res) {
    let info = await dtoday.getInfo()
    res.json(info);
});

router.get('/dtoday/:id', async function (req, res) {
    let id = req.params.id;
    let info = await dtoday.getById(id.toUpperCase());
    if (!info) {
        res.status(400);
        res.json({ "error": "not found" });
    } else {
        res.json(info);
    }
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