'use strict';
const utils = require("../app/utils")
module.exports = {
    setFiatObject(id, symbol, type, priceVes, priceUsd) {
        return {
            id: id,
            symbol: symbol,
            type: type,
            price_bs: priceVes,
            price_usd: priceUsd
        }
    },
    getCryptoWithFormat(coins,btcCoin,euroPrice) {
        return coins.map(el => {
            return {
                id: el.id,
                cmc_id: el.cmc_id,
                symbol: el.symbol,
                type: "crypto",
                price_btc: utils.getQuantityRelBTC(btcCoin, el),
                price_usd: el.price_usd,
                price_eur: el.price_usd / euroPrice,
                percent4rent: el.percent4rent,
                profit: el.profit,
                image: utils.getSVGimage(el.symbol.toLowerCase())
            };
        })
    },
    getPricesWithFormat(currencyList) {
        return currencyList.map(el => {
            return { name: el.code, price: el.price, updated: el.updatedAt };
        })
    },

}
                