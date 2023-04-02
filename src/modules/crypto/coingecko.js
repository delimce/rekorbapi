'use strict';
const CoinGecko = require('coingecko-api');
const utils = require("../app/utils");
//Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

module.exports =
{
    async ping() {
        const data = await CoinGeckoClient.ping();
        return utils.getGeckoRequest(data)
    },
    async getList() {
        try{
            const data = await CoinGeckoClient.coins.list();
            return utils.getGeckoRequest(data)
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    async getPricesByIds(ids) {
        const data = await CoinGeckoClient.simple.price({
            ids: ids,
            vs_currencies: ['usd', 'eur'],
        });
        return utils.getGeckoRequest(data)
    },


}