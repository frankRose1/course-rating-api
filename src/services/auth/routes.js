import mongoose from 'mongoose'
import { HTTP400Error } from '../../utils/httpErrors'
import { validateAuthCredentials } from '../../utils/validation'

const User = mongoose.model('User');

export default [
    {
        path: '/api/auth',
        method: 'post',
        handler: async (req, res) => {
            const { error, value } = validateAuthCredentials(req.body);

            if (error) {
                throw new HTTP400Error(error.details);
            }

            const { username, password } = value;

            const user = await User.findOne({ username });

            if (!user) {
                throw new HTTP400Error('Invalid username or password');
            }

            const isValidPassword = user.authenticate(password);

            if (!isValidPassword) {
                throw new HTTP400Error('Invalid username or password');
            }

            const token = user.generateAuthToken();

            res.json({ token });
        }
    }
]