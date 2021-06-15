'use strict';

const scrapeIt = require("scrape-it");
const dolarMonitorUrl = "https://monitordolarvenezuela.com/monitor-pantalla-completa";
const priceModel = require('../../models/fiatPrices');

module.exports = {
    getUsdPrice: async function () {
        let info = await scrapeIt(dolarMonitorUrl, {
            title: "title"
        });
        return this.convertTitleToPrice(info.data) //Bs
    },
    convertTitleToPrice: function (data) {
        let title = data.title.split("-");
        let price = title[0].trim().split(" ");
        return Number(price[1].replace(/\./g,'').replace(',', '.'))
    },
    async getUsdPriceFromDb() {
        const monitor = await priceModel.findOne({ code: "MONITOR" }).exec();
        return (monitor) ? today.price : 0.0;
    }
}

