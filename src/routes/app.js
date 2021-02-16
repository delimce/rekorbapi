const express = require('express');
let router = express.Router();

const apicache = require('apicache');
let cache = apicache.middleware;

const self = require("../modules/app/selfCalls");
const utils = require("../modules/app/utils");

router.post('/dashboard', async function (req, res) {

  let coins = await req.body;
  //multiple call
  const [coinMarketCap, dolartoday, floatrates] = await Promise.all([
    self.cmcAll(),
    self.dtodayInfo(),
    self.floatrates()
  ]);

  let selectedCoins = await utils.findCoins(coinMarketCap, coins)
  let price_gold_gram = await utils.goldPriceGram(dolartoday.GOLD.rate);
  let btcCoin = await selectedCoins.find(el => { return el.symbol === "BTC" });
  let floa_euro = await floatrates.find(el => { return el.code === "EUR" });
  let floa_ars = await floatrates.find(el => { return el.code === "ARS" });
  let currency = selectedCoins.map(el => {
    return {
      id: el.id,
      cmc_id: el.cmc_id,
      symbol: el.symbol,
      type: "crypto",
      typrice_btc: "crypto",
      price_btc: utils.getQuantityRelBTC(btcCoin, el),
      price_usd: el.price_usd,
      percent4rent: el.percent4rent,
      profit: el.profit,
      image: utils.getSVGimage(el.symbol.toLowerCase())
    };
  })

  //dolartoday data
  let dollar = {
    id: "dollar",
    symbol: "USD",
    type: "fiat",
    price_bs: Number(dolartoday.USD.dolartoday),
    price_usd: 1
  };

  currency.push(dollar);

  let euro = {
    id: "euro",
    symbol: "EUR",
    type: "fiat",
    price_bs: Number(dolartoday.EUR.dolartoday),
    price_usd: floa_euro.inverseRate
  };

  currency.push(euro);

  let arg = {
    id: "arg",
    symbol: "ARS",
    type: "fiat",
    price_bs: Number(floa_ars.inverseRate * dolartoday.USD.dolartoday),
    price_usd: floa_ars.inverseRate
  };

  currency.push(arg);

  let gold = {
    id: "gold",
    symbol: "GOLD",
    type: "commodity",
    price_bs: Number(dolartoday.USD.dolartoday * price_gold_gram),
    price_usd: Number(price_gold_gram)
  };

  currency.push(gold);

  res.json(currency);
});

module.exports = router;