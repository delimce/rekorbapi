'use stricts'
const { createCatchClause, toEditorSettings } = require('typescript');
const User = require('../../models/user');

const utils = require('../app/utils');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async insert(data) {
        try {
            const user = new User(data);
            user.token = uuidv4();
            let result = await user.save();
            return utils.setMongooseResponse(true, "user created", result);
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    },
    async getById(id) {
        try {
            let result = await User.findById(id)
            return utils.setMongooseResponse(true, "ok", result);
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    },
    async activate(email, token) {
        try {
            let result = await User.findOne({ email: email, token: token });
            result.active = true;
            result.token = null;
            result.save();
            return utils.setMongooseResponse(true);
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    },
    async isActive(id) {
        try {
            let result = await User.findById(id)
            return result.active;
        } catch (err) {
            return false;
        }
    }

}