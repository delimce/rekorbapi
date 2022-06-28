'use strict';
const investmentRepository = require('../../repositories/investmentRepository');
const userRepository = require('../../repositories/userRepository');
const utils = require('../app/utils');
const logger = require('../app/logger');

module.exports =
{
    create: async (data, token) => {
        try {
            const user = await userRepository.getByToken(token);
            data.user = {
                name: user.name,
                email: user.email
            };

            let result = await investmentRepository.save(data);
            return utils.setMongooseResponse(true, "investment created", result);
        } catch (err) {
            logger.error(`Error creating investment: ${err.message}`);
            return utils.setMongooseResponse(false, err.message);
        }
    },
    getById: async (id) => {
        try {
            let result = await investmentRepository.getById(id);
            return utils.setMongooseResponse(true, "investment found", result);
        } catch (err) {
            logger.error(`Error getting investment: ${err.message}`);
            return utils.setMongooseResponse(false, err.message);
        }
    },
    listByEmail: async (token) => {
        try {
            const user = await userRepository.getByToken(token);
            const filter = { 'user.email': user.email };
            let result = await investmentRepository.find(filter);
            const msg = (result.length > 0) ? `${result.length} investments found` : "No investments found";
            return utils.setMongooseResponse(true, msg, result);
        } catch (err) {
            logger.error(`Error getting investments: ${err.message}`);
            return utils.setMongooseResponse(false, err.message);
        }
    },
    deleteById: async (id) => {
        try {
            let result = await investmentRepository.deleteById(id);
            return utils.setMongooseResponse(true, "investment deleted", result);
        } catch (err) {
            logger.error(`Error deleting investment: ${err.message}`);
            return utils.setMongooseResponse(false, err.message);
        }
    }
}
