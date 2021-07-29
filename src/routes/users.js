const express = require('express');
const users = require("../modules/users/user");
let router = express.Router();


router.post('/new', async function (req, res) {
    let data = req.body;
    let result = await users.insert(data);
    if (result.success) {
        let user = result.data;
        users.sendUserRegisteredEmail(user);
        res.json(result);
    } else {
        res.status(400);
        res.send(result);
    }
});

router.post('/login', async function (req, res) {
    let data = req.body;
    let result = await users.login(data.email, data.password);
    if (result.success) {
        let user = result.data;
        res.json(result);
    } else {
        res.status(401);
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