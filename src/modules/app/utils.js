'use strict';
const svg64 = require('svg64');
const fs = require("fs");
const countries = require('../../../public/enums/countries.json')

module.exports =
{
    findCoins(cmcCoins, coins) {
        return cmcCoins.filter((el) => {
            return coins.includes(el.symbol);
        })
    },
    getCountryByCode(code) {
        return countries.find(el => el.cod.toLowerCase() === String(code).toLowerCase());
    },
    goldPriceGram(oz_price) {
        const gramxOz = 0.035274;
        return gramxOz * oz_price
    },
    getQuantityRelBTC(btc, altCoin) {
        let finalPrice =
            altCoin.symbol === "BTC"
                ? 1
                : Number(altCoin.price_usd / btc.price_usd).toFixed(8);
        return Number(finalPrice);
    },
    getSVGimage(image) {
        let path = "./public/svg/" + image + ".svg";
        let svg = false;
        if (fs.existsSync(path)) {
            svg = fs.readFileSync(path, 'utf-8');
        } else {
            svg = fs.readFileSync("./public/svg/auto.svg", 'utf-8');
        }
        return svg64(svg);
    },
    getPriceCurrencyInUSD(price) {
        return (price) ? Number(1.0 / price) : 0.0;
    },
    getGeckoRequest(result) {
        return (result.success) ? result.data : false;
    },
    getConvertToDecimal(value) {
        let transform = Number(value).toFixed(2)
        return Number(transform);
    },
    anyElementsInText(myText, elements) {
        const keys = elements.split(",");
        let result = false;
        keys.forEach(el => {
            if (myText.includes(el.trim())) {
                result = true;
                return;
            }
        });
        return result;
    },
    getTokenByRequest(req) {
        const token = req.headers["x-access-token"] || req.headers["authorization"];
        return token || false;
    },
    setMongooseResponse(result, msg = "ok", data = {}) {
        let info = { success: true, message: msg };
        if (!result) {
            info.success = false;
            info.message = (msg === "ok") ? "error" : msg;
        } else {
            info.data = data
        }
        return info;
    },
    getDateNow() {
        return new Date().toLocaleString(process.env.APP_LOCALE, { timeZone: process.env.APP_TIMEZONE })
    },
    generateRandomPassword: () => {
        return Math.random().toString(36).slice(-8);
    },
    convertDateToTimestamp: (dateString) => {
        let date = new Date(dateString);
        return date.getTime();
    }
}