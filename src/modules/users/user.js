'use stricts'
const User = require('../../models/user');

const utils = require('../app/utils');
const { v4: uuidv4 } = require('uuid');
const email = require('../app/email');
const jsrender = require('jsrender');

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
            return await User.findById(id)
        } catch (err) {
            return false
        }
    },
    async getByToken(token) {
        try {
            return (await User.findOne({ token: token })).toObject()
        } catch (err) {
            return false
        }
    },
    async activate(email, token) {
        try {
            await User.findOneAndUpdate({ email: email, token: token }, { active: true, token: uuidv4() });
            return utils.setMongooseResponse(true);
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    },
    async isActive(token) {
        try {
            let result = await this.getByToken(token)
            return result.active;
        } catch (err) {
            return false;
        }
    },
    async sendUserRegisteredEmail(user) {
        email.setSubject("Registro de usuario");
        email.setTo(user.email);
        let template = jsrender.templates('./src/templates/emails/register.html');
        let html = template.render(user);
        email.setHtml(html);
        await email.send();
    }
}