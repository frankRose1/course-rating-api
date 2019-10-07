/**
 * Import all service routes here and export them as a single Array
 */
import authRoutes from './auth/routes';
import userRoutes from './user/routes';
import courseRoutes from './course/routes';
import reviewRoutes from './review/routes';

export default [
    ...authRoutes,
    ...userRoutes,
    ...courseRoutes,
    ...reviewRoutes
]