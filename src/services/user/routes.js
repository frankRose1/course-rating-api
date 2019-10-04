import mongoose from 'mongoose';
import { validateCreateUser } from '../../utils/validation';
import { HTTP400Error } from '../../utils/httpErrors';

const User = mongoose.model('User');

export default [
    {
        path: '/api/users',
        method: 'post',
        handler: async (req, res) => {
            const { error, value } = validateCreateUser(req.body);

            if (error) {
                throw new HTTP400Error(error.details);
            }

            const user = new User(value);
            await user.save()
            res
              .location('/api/auth')
              .sendStatus(201)
        }
    },
]