import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { HTTP401Error, HTTP404Error } from '../utils/httpErrors';

const User = mongoose.model('User')

/**
 * Authentication middleware to protect end points.
 * Will populate "req.user" if a valid JWT is provided.
 */
export default async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        throw new HTTP401Error('Unauthorized. No token provided.')
    }

    try {
        const { username } = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({ username });
        
        if (!user) {
            throw new HTTP404Error('User not found.')
        }

        req.user = user;
        next();

    } catch (e) {
        throw new HTTP401Error('Invalid Token.')
    }
}