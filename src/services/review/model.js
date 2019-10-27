import mongoose, { Schema } from 'mongoose';

const ReviewSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'User is required to create a review.']
  },
  course: {
    type: Schema.ObjectId,
    ref: 'Course',
    required: [true, 'A review must belong to a specific course.']
  },
  rating: {
    type: Number,
    required: [true, 'Please leave a rating.'],
    min: [1, '1 is the lowest possible rating.'],
    max: [5, '5 is the highest possible rating.']
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

/**
 * Make sure a user has permission to modify a review
 * @param {ObjectId} userId - The ID of the user trying to modify/delete the record
 * @return {Boolean} comparison of review.user === userId
 */
ReviewSchema.methods.hasPermission = function(userId){
  return this.user.toString() == userId.toString();
}

export default mongoose.model('Review', ReviewSchema);