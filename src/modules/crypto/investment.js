'use strict';
const InvestmentRepository = require('../../repositories/investmentRepository');
const UserRepository = require('../../repositories/userRepository');
const utils = require('../app/utils');

module.exports = {
    create: async function (investment) {
        try {
            let result = await InvestmentRepository.save(investment);
            return utils.setMongooseResponse(true, "investment created", result);
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    },
    deleteById: async function (id) {
        try {
            let result = await InvestmentRepository.deleteById(id);
            return utils.setMongooseResponse(true, "investment deleted", result);
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    },
    getById: async function (id) {
        try {
            return await InvestmentRepository.getById(id);
        } catch (err) {
            return false
        }
    },
    saveNewInvestmentWithUser: async function (investment, token) {
        let user = await UserRepository.getByToken(token)
        if (user) {
            let data = {};
            data.name = user.name;
            data.email = user.email;
            investment.user = data;
            return this.create(investment);
        }
    },
    getInvestmentsByUser: async function (token) {
        try {
            const user = await UserRepository.getByToken(token);
            const investments = await InvestmentRepository.find({ 'user.email': user.email })
            return utils.setMongooseResponse(true, "", investments);
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    }
}