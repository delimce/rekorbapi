'use strict'
const express = require('express');
const lbtcRobot = require('../modules/robots/lbtcRobot')
let router = express.Router();

router.get('/localbtc/posts', async function (req, res) {
        try {  
                let result = await lbtcRobot.findPosts();
                res.json(result);
        } catch (err) {
                res.status(500);
                res.send(err)
        }
});

module.exports = router;