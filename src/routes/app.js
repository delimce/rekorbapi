const express = require('express');
let router = express.Router();

const countries = require('../../public/enums/countries.json');
const self = require("../modules/app/selfCalls");
const utils = require("../modules/app/utils");
const dashboard = require("../modules/app/dashboard");
const priceRepository = require('../repositories/priceRepository');
const prices = require('../modules/fiat/prices')
const apicache = require('apicache');
const logger = require('../modules/app/logger');

const onlyStatus200 = (req, res) => res.statusCode === 200;
let cache = apicache.middleware;
const cacheSuccesses = cache('45 minutes', onlyStatus200);


/**
 * @deprecated: use dashboard
 * try to delete if its not in use
 */
router.post('/dashboard2', async function (req, res) {
  let data = await req.body;
  //multiple call
  logger.info(`request for dashboard2: ${JSON.stringify(data)}`);
  const result = await getDashboardDataCoins(data);
  res.json(result);
});


router.post('/dashboard', async (req, res) => {
  let data = await req.body;
  logger.info(`request for dashboard: ${JSON.stringify(data)}`);
  let response = {}

  const pricesVes = await priceRepository.findBy({ currency: "ves" });

  response.coins = await getDashboardDataCoins(data);
  response.countries = countries;
  response.prices = await dashboard.getPricesWithFormat(pricesVes);
  res.json(response);

})

const getDashboardDataCoins = async (input) => {
  const data = input
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

  let currencyList = dashboard.getCryptoWithFormat(selectedCoins, btcCoin, floa_euro.inverseRate);

  const dollar = dashboard.setFiatObject("dollar", "USD", "fiat", vesPrice, 1);
  currencyList.push(dollar);

  const euro = dashboard.setFiatObject("euro", "EUR", "fiat", vesPrice * floa_euro.inverseRate, floa_euro.inverseRate);
  currencyList.push(euro);

  const arg = dashboard.setFiatObject("arg", "ARS", "fiat", Number(ars_price * vesPrice), ars_price);
  currencyList.push(arg);

  const gold = dashboard.setFiatObject("gold", "GOLD", "commodity", Number(vesPrice * price_gold_gram), Number(price_gold_gram));
  currencyList.push(gold);

  return currencyList;
}

router.get('/fiat/ves/prices', cacheSuccesses, async function (req, res) {
  const data = await priceRepository.findBy({ currency: "ves" })
  logger.info(`request for ves prices: ${JSON.stringify(data)}`);
  const prices = dashboard.getPricesWithFormat(data);
  res.json(prices);
});

module.exports = router;