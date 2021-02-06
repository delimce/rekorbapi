const express = require('express');
const dtoday = require("../modules/dolarToday");
let router = express.Router();

router.get('/dtoday', async function (req, res) {
    let info = await dtoday.getInfo();
    res.json(info);
});

module.exports = router;