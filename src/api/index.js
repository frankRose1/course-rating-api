/**
 * Import the router from each api and export as a single Array
 */
import authRoutes from './auth';
import userRoutesV1 from './v1/user';
import courseRoutesV1 from './v1/course';
import reviewRoutesV1 from './v1/review';
import categoryRoutesV1 from './v1/category';

export default [
  { prefix: '/api/auth', endpoints: authRoutes },
  { prefix: '/api/v1/users', endpoints: userRoutesV1 },
  { prefix: '/api/v1/courses', endpoints: courseRoutesV1 },
  { prefix: '/api/v1/reviews', endpoints: reviewRoutesV1 },
  { prefix: '/api/v1/categories', endpoints: categoryRoutesV1 }
];
