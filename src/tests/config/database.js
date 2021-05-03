require('dotenv').config()
const host = process.env.DATABASE_HOST;
const port = process.env.DATABASE_PORT;
const db = process.env.DATABASE_TEST;

// todo: connect without user and password
const uri = "mongodb://" + host + ":" + port + "/" + db;

const mongoose = require('mongoose')

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer({ binary: { version: 'latest' } })

const dbConnect = async () => {
    const mongooseOpts = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    };
    await mongoose.connect(uri, mongooseOpts);
}

const dbDisconnect = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

module.exports = {
    dbConnect,
    dbDisconnect
}