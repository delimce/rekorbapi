const express = require('express');
let router = express.Router();

const apicache = require('apicache');
let cache = apicache.middleware;

router.get('/main', async function (req, res) {
    res.send("main");
  });

module.exports = router;