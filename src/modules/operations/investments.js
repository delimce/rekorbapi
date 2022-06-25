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
    }
}
