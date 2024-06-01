const express = require('express');
let router = express.Router();

const countries = require('../../public/enums/countries.json');
const selfCalls = require("../modules/app/selfCalls");
const utils = require("../modules/app/utils");
const dashboard = require("../modules/app/dashboard");
const priceRepository = require('../repositories/priceRepository');
const prices = require('../modules/fiat/prices')
const apicache = require('apicache');
const logger = require('../modules/app/logger');

const onlyStatus200 = (req, res) => res.statusCode === 200;
let cache = apicache.middleware;
const cacheSuccesses = cache('45 minutes', onlyStatus200);


router.post('/dashboard', async (req, res) => {
  let data = await req.body;
  logger.info(`request for dashboard: ${JSON.stringify(data)}`);
  let response = {}

  logger.info(`get ves prices from db`);
  const pricesVes = await priceRepository.findBy({ currency: "ves" });

  logger.info(`get  dashboard data coins`);
  response.coins = await getDashboardDataCoins(data);
  response.countries = countries;
  logger.info(`formatting`);
  response.prices = await dashboard.getPricesWithFormat(pricesVes);
  logger.info(`Done!`);
  res.json(response);

})

const getDashboardDataCoins = async (input) => {
  const data = input

  const coinMarketCapPromise = selfCalls.cmcAll();
  const floatratesPromise = selfCalls.floatrates();
  const bluelyticsPromise = selfCalls.bluelyticsPrice();

  logger.info(`operations: getting data bluelytics`)
  const bluelytics = await bluelyticsPromise;
  logger.info(`operations: getting data floatrates`)
  const floatrates = await floatratesPromise;
  logger.info(`operations: getting data cmc`)
  const coinMarketCap = await coinMarketCapPromise;



  logger.info(`operations: filtering coins`);
  let selectedCoins = await utils.findCoins(coinMarketCap, data.coinList)
  const onzPrice = 1925.00; // @TODO: get from api GOLD onzPrice
  let price_gold_gram = utils.goldPriceGram(onzPrice);
  let btcCoin = await selectedCoins.find(el => { return el.symbol === "BTC" });
  let floa_euro = await floatrates.find(el => { return el.code === "EUR" });
  let floa_sek = await floatrates.find(el => { return el.code === "SEK" });
  let blue_ars = await bluelytics.find(el => { return el.name === "blue" });
  let ars_price = utils.getPriceCurrencyInUSD(blue_ars.price_sell);
  const vesOption = await prices.getByCode(data.vesOption);
  const vesPrice = vesOption.price || 0;

  logger.info(`operations: setting currency list`);

  let currencyList = dashboard.getCryptoWithFormat(selectedCoins, btcCoin, floa_euro.inverseRate);

  const dollar = dashboard.setFiatObject("dollar", "USD", "fiat", vesPrice, 1);
  currencyList.push(dollar);

  const euro = dashboard.setFiatObject("euro", "EUR", "fiat", vesPrice * floa_euro.inverseRate, floa_euro.inverseRate);
  currencyList.push(euro);

  const arg = dashboard.setFiatObject("arg", "ARS", "fiat", Number(ars_price * vesPrice), ars_price);
  currencyList.push(arg);

  // add sek to currencyList 
  const sek = dashboard.setFiatObject("sek", "SEK", "fiat", Number(vesPrice * floa_sek.inverseRate), floa_sek.inverseRate);
  currencyList.push(sek);

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