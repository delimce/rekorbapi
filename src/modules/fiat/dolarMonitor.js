'use strict';

const priceModel = require('../../models/fiatPrices');
const { findFirstResultPost } = require('../robots/lbtcRobot');
const allDollarVen = require('./allDollarVen');

module.exports = {
    getUsdPrice: async function () {
        let dollar = await allDollarVen.getBySlug("dolar-monitor");
        if (dollar) {
            return dollar.price;
        }
    },
    async getUsdPriceFromDb() {
        const monitor = await priceModel.findOne({ code: "MONITOR" }).exec();
        return (monitor) ? today.price : 0.0;
    }
}

