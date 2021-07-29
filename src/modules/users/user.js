'use stricts'
const User = require('../../models/user');

const utils = require('../app/utils');
const { v4: uuidv4 } = require('uuid');
const email = require('../app/email');
const jsrender = require('jsrender');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const UNAVAILABLE_EMAIL_MSG = 'Email unavailable or user inactive';

module.exports = {
    async insert(data) {
        try {
            const user = new User(data);
            user.token = uuidv4();
            user.password = bcrypt.hashSync(user.password, SALT_ROUNDS);
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
    async getDataByEmail(email) {
        let data = await User.findOne({ email: email.toLowerCase(), active: true });
        return (!data) ? false : data;
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
    async login(email, password) {
        try {
            let data = await this.getDataByEmail(email);
            if (!data) {
                return utils.setMongooseResponse(false, UNAVAILABLE_EMAIL_MSG);
            }
            if (bcrypt.compareSync(password, data.password)) {
                return utils.setMongooseResponse(true, "", data); // OK
            } else {
                return utils.setMongooseResponse(false, "Error in password");
            }
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    },
    async rememberPassword(email) {
        try {
            let data = await this.getDataByEmail(email);
            if (!data) {
                return utils.setMongooseResponse(false, UNAVAILABLE_EMAIL_MSG);
            }
            let newPass = utils.generateRandomPassword();
            let hashPass = bcrypt.hashSync(newPass, SALT_ROUNDS);
            await User.findOneAndUpdate({ email: email }, { password: hashPass, token: uuidv4() });
            let result = {
                name: data.name,
                email: data.email,
                password: newPass
            }
            return utils.setMongooseResponse(true, "temporary password created", result);
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    },
    async sendUserRegisteredEmail(user) {
        email.setSubject("Registro de usuario");
        email.setTo(user.email);
        let template = jsrender.templates('./src/templates/emails/register.html');
        let html = template.render(user);
        email.setHtml(html);
        await email.send();
    },
    async sendNewPasswordEmail(data) {
        email.setSubject("Nueva contraseña temporal");
        email.setTo(data.email);
        let template = jsrender.templates('./src/templates/emails/remember.html');
        let html = template.render(data);
        email.setHtml(html);
        await email.send();
    }
}