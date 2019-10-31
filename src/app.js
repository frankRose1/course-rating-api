import express from 'express';
import middleware from './middleware';
import './services/user/model';
import './services/course/model';
import './services/review/model';
import './services/category/model';
import routes from './api';
import errorHandlers from './middleware/errorHandlers';
import { applyMiddleware, applyRoutes } from './utils';

const app = express();

applyMiddleware(middleware, app);
applyRoutes(routes, app);
applyMiddleware(errorHandlers, app);

export default app;
