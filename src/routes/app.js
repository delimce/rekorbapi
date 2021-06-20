const express = require('express');
let router = express.Router();

const self = require("../modules/app/selfCalls");
const utils = require("../modules/app/utils");
const priceModel = require('../models/fiatPrices');

router.post('/dashboard', async function (req, res) {

  let coins = await req.body;
  //multiple call
  const [coinMarketCap, dolartoday, floatrates, bluelytics] = await Promise.all([
    self.cmcAll(),
    self.dtodayInfo(),
    self.floatrates(),
    self.bluelyticsPrice()
  ]);

  let selectedCoins = await utils.findCoins(coinMarketCap, coins)
  let price_gold_gram = utils.goldPriceGram(dolartoday.GOLD.rate);
  let btcCoin = await selectedCoins.find(el => { return el.symbol === "BTC" });
  let floa_euro = await floatrates.find(el => { return el.code === "EUR" });
  let blue_ars = await bluelytics.find(el => { return el.name === "blue" });
  let ars_price = utils.getPriceCurrencyInUSD(blue_ars.price_sell);
  // let floa_ars = await floatrates.find(el => { return el.code === "ARS" });
  let currency = selectedCoins.map(el => {
    return {
      id: el.id,
      cmc_id: el.cmc_id,
      symbol: el.symbol,
      type: "crypto",
      price_btc: utils.getQuantityRelBTC(btcCoin, el),
      price_usd: el.price_usd,
      price_eur: el.price_usd / floa_euro.inverseRate,
      percent4rent: el.percent4rent,
      profit: el.profit,
      image: utils.getSVGimage(el.symbol.toLowerCase())
    };
  })

  let dollar = utils.setFiatObject("dollar", "USD", "fiat", Number(dolartoday.USD.dolartoday), 1);
  currency.push(dollar);

  let euro = utils.setFiatObject("euro", "EUR", "fiat", Number(dolartoday.EUR.dolartoday), floa_euro.inverseRate);
  currency.push(euro);

  let arg = utils.setFiatObject("arg", "ARS", "fiat", Number(ars_price * dolartoday.USD.dolartoday), ars_price);
  currency.push(arg);

  let gold = utils.setFiatObject("gold", "GOLD", "commodity", Number(dolartoday.USD.dolartoday * price_gold_gram), Number(price_gold_gram));
  currency.push(gold);

  res.json(currency);
});

router.get('/fiat/ves/prices', async function (req, res) {
  const data = await priceModel.find({ currency: "ves" }).select(['code', 'price']).exec();
  const prices = data.map(el => {
    return { name: el.code, price: el.price };
  })
  res.json(prices);
});

module.exports = router;