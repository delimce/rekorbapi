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
    getQuantityRelBTC(btc, altcoin) {
        let finalPrice =
            altcoin.symbol === "BTC"
                ? 1
                : Number(altcoin.price_usd / btc.price_usd).toFixed(8);
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
    }
}