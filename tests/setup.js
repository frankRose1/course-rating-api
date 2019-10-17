import mongoose from 'mongoose'
import client from '../src/databases/redisClient'

const { 
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT
} = process.env;

const base_uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}`;

/**
 * Remove all collections in the database
 */
const removeAllCollections = async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany();
    }
}

const dropAllCollections = async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.drop();
        } catch (err) {
            // Sometimes this error happens but it can be safely ignored
            if (error.message === 'ns not found') return
            // This error occurs when using it.todo. Can also be safely ignored
            if(error.message.includes('a background operation is currently running')) return
            console.log(error.message)
        }
    }
}

/**
 * This helper function allows for easy concurrent testing. 
 * Will connect to mongodb before all tests in a suite run.
 * It will also remove collections after each test for a clean slate. 
 * After all tests in a suite run it will drop all collections and 
 * disconnect mongoose
 * @param {String} dbName - name of the mongodb database. Each test suite should
 * have it's own unique dbName 
 */
export const setupDB = dbName => {
    // Connect to mongodb
    beforeAll(async () => {
        const mongo_uri = `${base_uri}/${dbName}?authSource=admin`;
        await mongoose.connect(mongo_uri, { useNewUrlParser: true, useCreateIndex: true });
    })

    // Clean up database between each test
    afterEach(async () => {
        await removeAllCollections();
    })

    // Drop collections, disconnect mongoose, disconnect redis
    afterAll(async () => {
        await dropAllCollections()
        await Promise.all([
            mongoose.connection.close(),
            client.quit()
        ]);
    })
}