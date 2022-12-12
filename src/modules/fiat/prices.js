'use strict';
const PriceRepository = require('../../repositories/priceRepository');
const utils = require('../app/utils');

module.exports = {
    async insert(data) {
        try {
            let result = await PriceRepository.new(data);
            return utils.setMongooseResponse(true, "fiat price created", result);
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    },
    async getByCode(code) {
        try {
            return await PriceRepository.getByCode(code);
        } catch (err) {
            return false
        }
    },
    async newOrUpdate(code, data) {
        try {
           return await PriceRepository.newOrUpdate(code, data);
        } catch (err) {
            return false
        }
    },
    async deleteAll() {
        try {
            return await PriceRepository.deleteAll();
        } catch (err) {
            return false
        }
    }

}