'use strict'
const LocalBtcModel = require('../models/localBtc');

module.exports = {
    save: async (lBtcTrade) => {
        const lbc = new LocalBtcModel(lBtcTrade);
        return await lbc.save();
    },
    find: async (filters) => {
        return await LocalBtcModel.find(filters)
    },
    updateDataById: async (id, data) => {
        return await LocalBtcModel.findByIdAndUpdate(id, data);
    }
}