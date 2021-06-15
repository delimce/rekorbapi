'use strict';
const Prices = require('../../models/fiatPrices');
const utils = require('../app/utils');

module.exports = {
    async insert(data) {
        try {
            const price = new Prices(data);
            let result = await price.save();
            return utils.setMongooseResponse(true, "fiat price created", result);
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    },
    async getByCode(code) {
        try {
            return (await Prices.findOne({ code: code })).toObject()
        } catch (err) {
            return false
        }
    },
    async newOrUpdate(code, data) {
        try {
            const filter = { code: code };
            return await Prices.findOneAndUpdate(filter, data, {
                new: true,
                upsert: true
            });

        } catch (err) {
            return false
        }
    }
}