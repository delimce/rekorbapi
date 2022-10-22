'use strict';

const cheerio = require('cheerio');
const got = require('got');
const priceModel = require('../../models/fiatPrices');

const bcvUrl = "https://www.bcv.org.ve";

module.exports = {

    async getUsdPrice() {

        let info = await got(bcvUrl, { rejectUnauthorized: false }).then(response => {
            const $ = cheerio.load(response.body);
            let content = $('#dolar').children().last().find('strong').text().trim();
            return content;
        });
        let bcvPrice = info.split(" "); //money reconvert bcvPrice[1]
        return Number(bcvPrice[0].replace(/\./g, '').replace(',', '.'));
    },
    async getUsdPriceFromDb() {
        const bcv = await priceModel.findOne({ code: "BCV" }).exec();
        return (bcv) ? bcv.price : 0.0;
    }


}