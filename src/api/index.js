/**
 * Import the router from each api and export as a single Array
 */
import authRoutes from './auth';
import userRoutesV1 from './v1/user';
import courseRoutesV1 from './v1/course';
import reviewRoutesV1 from './v1/review';

export default [
    { prefix: '/api/auth', authRoutes },
    { prefix: '/api/v1/users', userRoutesV1 },
    { prefix: '/api/v1/courses', courseRoutesV1 },
    { prefix: '/api/v1/reviews', reviewRoutesV1 }
]