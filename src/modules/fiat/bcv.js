'use strict';

const cheerio = require('cheerio');
const got = require('got');
const priceModel = require('../../models/fiatPrices');
const allDollarVen = require('./allDollarVen');

const bcvUrl = "https://www.bcv.org.ve";

module.exports = {

    async getUsdPrice() {
        let dollar = await allDollarVen.getBySlug("dolar-bcv");
        if (dollar) {
            return dollar.price;
        }
    },
    async getUsdPriceFromDb() {
        const bcv = await priceModel.findOne({ code: "BCV" }).exec();
        return (bcv) ? bcv.price : 0.0;
    }


}