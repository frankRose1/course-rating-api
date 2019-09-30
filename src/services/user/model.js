import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', function(next){
    const user = this
    if (!user.isModified('password')) {
        return next()
    }

    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
          return next(err);
        }
    
        user.password = hash;
        next();
      });
})

export default mongoose.model('User', UserSchema);