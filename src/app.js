import express from 'express';
import middleware from './middleware';
import './services/user/model';
import './services/course/model';
import './services/review/model';
import routes from './api';
import errorHandlers from './middleware/errorHandlers';
import {
    applyMiddleware,
    applyRoutes
} from './utils'

/**
 * Create an express app, apply middleware, routes, and
 * any error handlers.
 * @return {Object} express app instance
 */
export const createApp = () => {
    const app = express();
    applyMiddleware(middleware, app);
    applyRoutes(routes, app);
    applyMiddleware(errorHandlers, app);
    return app
}

export default createApp()