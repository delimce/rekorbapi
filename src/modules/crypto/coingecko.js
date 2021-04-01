'use strict';
const CoinGecko = require('coingecko-api');
const utils = require("../app/utils");
//Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

module.exports =
{
    async ping() {
        let data = await CoinGeckoClient.ping();
        return utils.getGeckoRequest(data)
    },
    async getMarkets() {
        let data = await CoinGeckoClient.coins.markets();
        return utils.getGeckoRequest(data)
    },
    async getPricesByIds(ids) {
        let data = await CoinGeckoClient.simple.price({
            ids: ids,
            vs_currencies: ['usd', 'eur'],
        });
        return utils.getGeckoRequest(data)
    },


}