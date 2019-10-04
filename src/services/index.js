/**
 * Import all service routes here and export them as a sing Array
 */
import authRoutes from './auth/routes';
import userRoutes from './user/routes';

export default [
    ...authRoutes,
    ...userRoutes
]