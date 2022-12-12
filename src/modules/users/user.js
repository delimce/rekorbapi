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
            return utils.setMongooseResponse(false, this.savingErrorsHandler(err.message));
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
    async activate(mail, token) {
        try {
            await UserRepository.setDocByFilters({ email: mail, token: token }, { active: true, token: uuidv4() });
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
    async login(mail, password) {
        try {
            let data = await UserRepository.getDataByEmail(mail);
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
    async rememberPassword(mail) {
        try {
            let data = await UserRepository.getDataByEmail(mail);
            if (!data) {
                return utils.setMongooseResponse(false, UNAVAILABLE_EMAIL_MSG);
            }
            let newPass = utils.generateRandomPassword();
            let hashPass = bcrypt.hashSync(newPass, SALT_ROUNDS);
            await UserRepository.setDocByFilters({ email: mail }, { password: hashPass, token: uuidv4() });
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
    async changePassword(token, password, passwordRepeated) {
        let success = false;
        let message = "";
        try {
            if (password === passwordRepeated) {
                let user = {}
                user.password = bcrypt.hashSync(password, SALT_ROUNDS);
                await UserRepository.setDocByFilters({ token: token }, user);
                success = true;
                message = "Password has changed";
            } else {
                message = "Both passwords don't match"
            }
        } catch (err) {
            message = err.message;
        } finally {
            return utils.setMongooseResponse(success, message);
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
        let template = jsRender.templates('./public/templates/emails/register.html');
        let html = template.render(user);
        email.setHtml(html);
        await email.send();
    },
    async sendNewPasswordEmail(data) {
        email.setSubject("Nueva contraseña temporal");
        email.setTo(data.email);
        let template = jsRender.templates('./public/templates/emails/remember.html');
        let html = template.render(data);
        email.setHtml(html);
        await email.send();
    },
    savingErrorsHandler(message) {
        const errors =
        {
            E11000: "Email already exists",
            required: "All fields are required"
        }
        const patterns = Object.keys(errors);
        let errorsFounded = patterns.filter((el) => {
            let word = String(el);
            return message.includes(word)
        })
        return errors[errorsFounded[0]] || "unexpected error"
    },
    deleteAll() {
        try {
            UserRepository.deleteAll();
            return utils.setMongooseResponse(true);
        } catch (err) {
            return utils.setMongooseResponse(false, err.message);
        }
    }
}