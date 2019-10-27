import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'MEMBER'],
    default: 'MEMBER',
    required: true
  },
  avatar: String
});

/**
 * Compare a plain text password against the hash stored in the database,
 * return true if it's a match
 * @param {String} password - Plain text password
 * @return {Boolean}
 */
UserSchema.methods.authenticate = async function(password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Create and return a JWT for a user
 * @return {String} encryped JWT
 */
UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ username: this.username }, process.env.SECRET_KEY, {
    expiresIn: '1h'
  });
  return token;
};

UserSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }

    user.password = hash;
    next();
  });
});

export default mongoose.model('User', UserSchema);
