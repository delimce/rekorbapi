'use strict';
const svg64 = require('svg64');
const fs = require("fs");

module.exports =
{
    findCoins(cmcCoins, coins) {
        return cmcCoins.filter((el) => {
            return coins.includes(el.symbol);
        })
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
    setMongooseResponse(result, msg = "ok", data = {}) {
        let info = { success: true, message: msg };
        if (!result) {
            info.success = false;
            info.message = (msg === "ok") ? "error" : msg;
        } else {
            info.data = data
        }
        return info;
    }
}