const express = require('express');
const users = require("../modules/users/user");
let router = express.Router();


router.post('/new', async function (req, res) {
    let data = req.body;
    let result = await users.insert(data);
    if (!result.success) {
        res.status(400);
    }
    res.json(result);
});

module.exports = router;