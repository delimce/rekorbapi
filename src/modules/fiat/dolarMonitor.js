'use strict';

const cheerio = require('cheerio');
const got = require('got');
const dolarMonitorUrl = "https://monitordolarvenezuela.com/monitor-pantalla-completa";
const priceModel = require('../../models/fiatPrices');

module.exports = {
    getUsdPrice: async function () {

        let info = await got(dolarMonitorUrl).then(response => {
            const $ = cheerio.load(response.body);
            let content = $('.head-price h1.text-center').text().trim();
            return content;
        });
        
        if (info == undefined || info == null || info == "") {
            return 0.0;
        }
        return this.convertTitleToPrice(info) //Bs
    },
    convertTitleToPrice: function (data) {
        let price = data.split(" ");
        return Number(price[1].replace(',', '.'))
    },
    async getUsdPriceFromDb() {
        const monitor = await priceModel.findOne({ code: "MONITOR" }).exec();
        return (monitor) ? today.price : 0.0;
    }
}

