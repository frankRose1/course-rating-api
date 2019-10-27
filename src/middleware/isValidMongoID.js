import mongoose from 'mongoose';
import { HTTP400Error } from '../utils/httpErrors';

/**
 * Handles invalid MongoDB ID's in the params on certain endpoints
 * to prevent "castToObjectID" errors
 */
export default (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)){
    throw new HTTP400Error('The provided object ID is invalid.');
  }

  next();
};