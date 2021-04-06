require('dotenv').config()
const mongoose = require('mongoose')
const host = process.env.DATABASE_HOST;
const port = process.env.DATABASE_PORT;
const db = process.env.DATABASE_TEST;

// todo: connect without user and password
const dbUri = "mongodb://" + host + ":" + port + "/" + db;

async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        await collection.deleteMany()
    }
}

async function dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        try {
            await collection.drop()
        } catch (error) {
            // Sometimes this error happens, but you can safely ignore it
            if (error.message === 'ns not found') return
            // This error occurs when you use it.todo. You can
            // safely ignore this error too
            if (error.message.includes('a background operation is currently running')) return
            console.log(error.message)
        }
    }
}

module.exports = {
    setupDB() {
        // Connect to Mongoose
        beforeAll(async () => {
            await mongoose.connect(dbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            })
        })


        // Cleans up database between each test
          afterEach(async () => {
             await removeAllCollections()
         })
 
        // Disconnect Mongoose
        afterAll(async () => {
            await dropAllCollections()
            await mongoose.connection.close()
        })
    }
}