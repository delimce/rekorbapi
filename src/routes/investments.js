'use strict'
const express = require('express');
const router = express.Router();
const investModule = require('../modules/operations/investments');
const logger = require('../modules/app/logger');
const utils = require("../modules/app/utils");
const auth = require('../middleware/auth');

router.post('/new', auth, async (req, res) => {
    let data = req.body;
    const token = utils.getTokenByRequest(req);
    let result = await investModule.create(data, token);
    if (result.success) {
        let investment = result.data;
        logger.info(`Investment ${investment.id} created`);
        res.json(result);
    } else {
        logger.error(result.message);
        res.status(400);
        res.send(result);
    }
});

router.get('/:id', auth, async (req, res) => {
    let id = req.params.id;
    let result = await investModule.getById(id);
    if (result.success) {
        res.json(result);
    } else {
        logger.error(result.message);
        res.status(400);
        res.send(result);
    }
});

module.exports = router;

