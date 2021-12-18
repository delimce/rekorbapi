'use strict'
const InvestmentModel = require('../models/investment');
module.exports = {
    save: async (data) => {
        const investment = new InvestmentModel(data);
        return await investment.save();
    },
    getById: async (id) => {
        return await InvestmentModel.findById(id)
    },
    find: async (filters) => {
        return await InvestmentModel.find(filters)
    },
    deleteById: async (id) => {
        return await InvestmentModel.deleteOne({ _id: id });
    }
}