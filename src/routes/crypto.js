const express = require('express');
let router = express.Router();
const cmc = require("../modules/coinmarketcap");

router.get('/cmc/all', async function (req, res) {
  let info = await cmc.getAll();
  let final = await cmc.shorInfoCoins(info)
  res.json(final);
});

router.get('/cmc/detail/:id', async function (req, res) {
  let info = await cmc.getById(req.params.id);
  res.json(info);
});

module.exports = router;