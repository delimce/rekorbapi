'use strict';

const axios = require('axios');

let apiKey = process.env.CMC_API_KEY;
let urlPath = "https://pro-api.coinmarketcap.com/v1/";

const axios_rest = axios.create({
    baseURL: urlPath,
    timeout: 2000,
    headers: { "X-CMC_PRO_API_KEY": apiKey }
});

module.exports =
{
    getAll: async function () {
        let coinMarketCap = {}
        try {
            coinMarketCap = await axios_rest.get('/cryptocurrency/listings/latest', {
                start: "1",
                limit: "100",
                convert: "USD",
                json: true,
                gzip: true
            })
            return coinMarketCap.data.data;
        } catch (error) {
            console.log(error)
            return false;
        }
    },
    getById: async function (id) {
        let coinMarketCap = {}
        let detail = {};
        try {
            coinMarketCap = await axios_rest.get('/cryptocurrency/quotes/latest?slug=' + id.toLowerCase())
            for (let index in coinMarketCap.data.data) {
                detail = this.parseCoinDetail(coinMarketCap.data.data, index);
            }
            return detail;
        } catch (error) {
            console.log(error)
        }
    },
    shorInfoCoins: function (coinMarketCap) {
        return coinMarketCap.map(el => {
            return this.parseCoin(el);
        })
    },
    parseCoin: function (coin) {
        let newCoin = {};
        newCoin.id = coin.slug;
        newCoin.cmc_id = coin.id;
        newCoin.symbol = coin.symbol;
        let usd_detail = coin.quote.USD;
        newCoin.price_usd = Number(usd_detail.price);
        newCoin.percent_1h = Number(usd_detail.percent_change_1h);
        newCoin.percent_24h = Number(usd_detail.percent_change_24h);
        newCoin.percent_7d = Number(usd_detail.percent_change_7d);
        newCoin.percent4rent = parseFloat(usd_detail.percent_change_1h + usd_detail.percent_change_24h).toFixed(3);
        newCoin.profit = newCoin.percent4rent >= 0 ? true : false;
        return newCoin;
    },
    parseCoinDetail: function (data, index) {
        let coin = data[index];
        return [
            {
                id: coin.slug,
                symbol: coin.symbol,
                name: coin.name,
                rank: coin.cmc_rank,
                price_usd: coin.quote.USD.price,
                price_btc: "1.0",
                "24h_volume_usd": coin.quote.USD.volume_24h,
                market_cap_usd: coin.quote.USD.market_cap,
                available_supply: coin.circulating_supply,
                total_supply: coin.quote.USD.total_supply,
                max_supply: coin.max_supply,
                percent_change_1h: coin.quote.USD.percent_change_1h,
                percent_change_24h: coin.quote.USD.percent_change_24h,
                percent_change_7d: coin.quote.USD.percent_change_7d,
                last_updated: this.convertDateToTimestamp(coin.quote.USD.last_updated),
                tags: coin.tags
            }
        ];
    },
    convertDateToTimestamp: function (dateString) {
        let date = new Date(dateString);
        return date.getTime();
    }

}