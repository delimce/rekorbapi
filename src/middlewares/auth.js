'use strict'
const user = require('../modules/users/user');
module.exports = async function (req, res, next) {
    //get the token from the header if present
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    //if no token found, return response (without going to the next middelware)
    if (!token) return res.status(401).send("Access denied. No token provided.");
    //if can verify the token, set req.user and pass to next middleware
    let isActive = await user.isActive(token)
    if (isActive) {
        next();
    } else {
        res.status(401).send("Access denied. Using token");
    }
};