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

    const usernameExists = await User.findOne({ username: value.username });

    if (usernameExists) {
      throw new HTTP400Error('Username is already taken.');
    }

    const emailExists = await User.findOne({ email: value.email });

    if (emailExists) {
      throw new HTTP400Error('Email is already in use.');
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
      .sendStatus(201);
};

export const getUser = async (req, res) => {
  const user = await User
    .findById(req.user._id)
    .select('-_id name username email avatar');

  if (!user) {
    throw new HTTP400Error('User not found.');
  }

  res.json({ user });
};