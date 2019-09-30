/**
 * Import all service routes here and export them as a sing Array
 */
import exampleRoutes from './example/routes';
import userRoutes from './user/routes';

export default [
    ...exampleRoutes,
    ...userRoutes
]