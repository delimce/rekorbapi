const express = require('express');
const users = require("../modules/users/user");
const auth = require('../middlewares/auth');
const email = require('../modules/app/email');
const jsrender = require('jsrender');
let router = express.Router();


router.post('/new', async function (req, res) {
    let data = req.body;
    let result = await users.insert(data);
    if (result.success) {
        let user = result.data;
        email.setSubject("Registro de usuario");
        email.setTo(user.email);
        let template = jsrender.templates('./src/templates/emails/register.html');
        let html = template.render(user);
        email.setHtml(html);
        await email.send();
        res.json(result);
    } else {
        res.status(400);
        res.send(result);
    }
});

router.get('/activate/:token', async function (req, res) {
    let token = req.params.token;
    let userData = await users.getByToken(token);
    if (userData) {
        let result = await users.activate(userData.email, userData.token);
        let newData = await users.getById(userData._id)
        result.data = newData;
        result.message = "user activated"
        res.json(result);
    } else {
        res.status(403);
        res.send("token unavailable");
    }
});

module.exports = router;