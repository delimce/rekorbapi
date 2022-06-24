'use strict';

const host = process.env.DATABASE_HOST;
const port = process.env.DATABASE_PORT;
const db = process.env.DATABASE_NAME;
const mongoose = require('mongoose');
const logger = require('../modules/app/logger');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: true,
    poolSize: 5, // Maintain up to 5 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

// todo: connect without user and password
const dbUri = "mongodb://" + host + ":" + port + "/" + db + "?retryWrites=true&w=majority";

module.exports = {
    connect() {
        mongoose.connect(dbUri, options).then(
            () => { console.log('database ' + db + ' connected'); },
            err => {
                console.log('database connection error');
                logger.error(err);
            }
        );
    }
}