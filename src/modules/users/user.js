'use strict'

const UserRepository = require('../../repositories/userRepository');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const utils = require('../../modules/app/utils');
const email = require('../../modules/app/email');
const jsRender = require('jsrender');
const UNAVAILABLE_EMAIL_MSG = 'Email unavailable or user inactive';
const SALT_ROUNDS = 10;

module.exports = {
    async insert(data) {
        try {
            const newUser = Object.assign({}, data);
            newUser.token = uuidv4();
            newUser.password = bcrypt.hashSync(data.password, SALT_ROUNDS);
            let result = await UserRepository.save(newUser);
            return utils.setMongooseResponse(true, "user created", result);
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    },
    async getById(id) {
        try {
            return await UserRepository.getById(id);
        } catch (err) {
            return false
        }
    },
    async getByToken(token) {
        try {
            return UserRepository.getByToken(token);
        } catch (err) {
            return false
        }
    },
    async activate(email, token) {
        try {
            await UserRepository.setDocByFilters({ email: email, token: token }, { active: true, token: uuidv4() });
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
            let data = await UserRepository.getDataByEmail(email);
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
            let data = await UserRepository.getDataByEmail(email);
            if (!data) {
                return utils.setMongooseResponse(false, UNAVAILABLE_EMAIL_MSG);
            }
            let newPass = utils.generateRandomPassword();
            let hashPass = bcrypt.hashSync(newPass, SALT_ROUNDS);
            await UserRepository.setDocByFilters({ email: email }, { password: hashPass, token: uuidv4() });
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
    async getOrCreateUserByEmail(data) {
        try {
            let user = await UserRepository.getDataByEmail(data.email);
            if (!user) {
                return this.insert(data);
            } else {
                return utils.setMongooseResponse(true, "user found", user);
            }
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    },
    async sendUserRegisteredEmail(user) {
        email.setSubject("Registro de usuario");
        email.setTo(user.email);
        let template = jsRender.templates('./src/templates/emails/register.html');
        let html = template.render(user);
        email.setHtml(html);
        await email.send();
    },
    async sendNewPasswordEmail(data) {
        email.setSubject("Nueva contraseña temporal");
        email.setTo(data.email);
        let template = jsRender.templates('./src/templates/emails/remember.html');
        let html = template.render(data);
        email.setHtml(html);
        await email.send();
    }
}