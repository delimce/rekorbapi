const express = require('express');
let router = express.Router();

const self = require("../modules/app/selfCalls");
const utils = require("../modules/app/utils");
const dashboard = require("../modules/app/dashboard");
const priceRepository = require('../repositories/priceRepository');
const prices = require('../modules/fiat/prices')
const apicache = require('apicache');

const onlyStatus200 = (req, res) => res.statusCode === 200;
let cache = apicache.middleware;
const cacheSuccesses = cache('45 minutes', onlyStatus200);


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

  let currency = dashboard.getCryptoWithFormat(selectedCoins, btcCoin, floa_euro.inverseRate);

  const dollar = dashboard.setFiatObject("dollar", "USD", "fiat", Number(dolartoday.USD.dolartoday), 1);
  currency.push(dollar);

  const euro = dashboard.setFiatObject("euro", "EUR", "fiat", Number(dolartoday.EUR.dolartoday), floa_euro.inverseRate);
  currency.push(euro);

  const arg = dashboard.setFiatObject("arg", "ARS", "fiat", Number(ars_price * dolartoday.USD.dolartoday), ars_price);
  currency.push(arg);

  const gold = dashboard.setFiatObject("gold", "GOLD", "commodity", Number(dolartoday.USD.dolartoday * price_gold_gram), Number(price_gold_gram));
  currency.push(gold);

  res.json(currency);
});


router.post('/dashboard2', async (req, res) => {
  let data = await req.body;
  const [coinMarketCap, dolartoday, floatrates, bluelytics] = await Promise.all([
    self.cmcAll(),
    self.dtodayInfo(),
    self.floatrates(),
    self.bluelyticsPrice()
  ]);

  let selectedCoins = await utils.findCoins(coinMarketCap, data.coinList)
  let price_gold_gram = utils.goldPriceGram(dolartoday.GOLD.rate);
  let btcCoin = await selectedCoins.find(el => { return el.symbol === "BTC" });
  let floa_euro = await floatrates.find(el => { return el.code === "EUR" });
  let blue_ars = await bluelytics.find(el => { return el.name === "blue" });
  let ars_price = utils.getPriceCurrencyInUSD(blue_ars.price_sell);
  const vesOption = await prices.getByCode(data.vesOption);
  const vesPrice = vesOption.price || 0;

  let currency = dashboard.getCryptoWithFormat(selectedCoins, btcCoin, floa_euro.inverseRate);

  const dollar = dashboard.setFiatObject("dollar", "USD", "fiat", vesPrice, 1);
  currency.push(dollar);

  const euro = dashboard.setFiatObject("euro", "EUR", "fiat", vesPrice * floa_euro.inverseRate, floa_euro.inverseRate);
  currency.push(euro);

  const arg = dashboard.setFiatObject("arg", "ARS", "fiat", Number(ars_price * vesPrice), ars_price);
  currency.push(arg);

  const gold = dashboard.setFiatObject("gold", "GOLD", "commodity", Number(vesPrice * price_gold_gram), Number(price_gold_gram));
  currency.push(gold);

  res.json(currency);

})

router.get('/fiat/ves/prices', cacheSuccesses, async function (req, res) {
  const data = await priceRepository.findBy({ currency: "ves" })
  const prices = data.map(el => {
    return { name: el.code, price: el.price };
  })
  res.json(prices);
});

module.exports = router;