'use strict'
const user = require('../modules/users/user');
const utils = require('../modules/app/utils');
const logger = require('../modules/app/logger');
module.exports = async function (req, res, next) {
    //get the token from the header if present
    const token = utils.getTokenByRequest(req);
    //if no token found, return response (without going to the next middelware)
    if (!token) return res.status(401).send("Access denied. No token provided.");
    logger.error(`Access denied. No token provided.`);
    //if can verify the token, set req.user and pass to next middleware
    let isActive = await user.isActive(token)
    if (isActive) {
        next();
    } else {
        logger.error(`User with token ${token} is not active or exists`);
        res.status(401).send("Access denied. Using token");
    }
};