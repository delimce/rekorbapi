'use strict'
const PriceModel = require('../models/fiatPrices');
module.exports = {
    new: async (data) => {
        const price = new PriceModel(data);
        return await price.save();
    },
    getByCode: async (code) => {
        return (await PriceModel.findOne({ code: code })).toObject()
    },
    newOrUpdate: async (code, data) => {
        const filter = { code: code };
        return await PriceModel.findOneAndUpdate(filter, data, {
            new: true,
            upsert: true
        });

    }
}