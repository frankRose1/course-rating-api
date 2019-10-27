import { HTTP403Error } from '../utils/httpErrors';

/**
 * Will verify is a user is an admin before letting them proceed.
 * Throws a 403 error if a user is not an admin.
 */
export default (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    throw new HTTP403Error(
      'Admin privileges are required to access this resource.'
    );
  }

  next();
};
