import mongoose from 'mongoose';
import gravatar from 'gravatar';
import { validateCreateUser } from '../../utils/validation';
import { HTTP400Error } from '../../utils/httpErrors';

const User = mongoose.model('User');

export const createUser = async (req, res) => {
    const { error, value } = validateCreateUser(req.body);

    if (error) {
        throw new HTTP400Error(error.details);
    }

    const avatar = gravatar.url(value.email, {
        r: 'pg', //Rating,
        s: '200', //Size
        d: 'mm' //Default photo
      });

    const data = {
        ...value,
        avatar 
    };

    const user = new User(data);
    await user.save();
    res
      .location('/api/auth')
      .sendStatus(201)
};