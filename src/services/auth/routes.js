import mongoose from 'mongoose'
import { HTTP400Error } from '../../utils/httpErrors'
import { validateAuthCredentials } from '../../utils/validation'

const User = mongoose.model('User')

export default [
    {
        path: '/api/auth',
        method: 'post',
        handler: [
            validateAuthCredentials,
            async (req, res) => {
                const { username, password } = req.body;

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
        ]
    }
]