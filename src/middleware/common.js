/**
 * Common middleware such as cors and compression
 */
import cors from 'cors';
import parser from 'body-parser';
import compression from 'compression';
import client from '../databases/redisClient';


/**
 * Apply cors middlware to the express app
 * @param {Object} app - Express application
 */
export const handleCors = app => {
    app.use(cors({credentials: true, origin: true}))
}

/**
 * Apply body parsing middleware to application
 * @param {Object} app - Express application
 */
export const handleBodyRequestParsing = app => {
    app.use(parser.urlencoded({ extended: true }))
    app.use(parser.json())
}

/**
 * Apply compression middlware to the express app
 * @param {Object} app - Express application
 */
export const handleCompression = app => {
    app.use(compression())
}

/**
 * Add the redis client to middleware so that it can be
 * easily accessed inside of route handlers
 * @param {Object} app - express app 
 */
export const handleRedisCache = app => {
    app.use((req, res, next) => {
        req.redis = client
        next()
    })
}