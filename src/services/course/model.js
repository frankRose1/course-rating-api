import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'You must provide a course title.']
      },
      user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: [true, 'A logged in user is required to create a course.']
      },
      description: {
        type: String,
        required: [true, 'Please provide a course description.'],
        trim: true
      },
      estimatedTime: {
        type: String,
        required: [true, 'Please provide an estimated time of course completion.'],
        trim: true
      },
      materialsNeeded: {
        type: String,
        trim: true
      },
      steps: [
        {
          stepNumber: Number,
          title: {
            type: String,
            required: [true, 'Please provide a step title.'],
            trim: true
          },
          description: {
            type: String,
            required: [true, 'Please provide a step description.'],
            trim: true
          }
        }
      ]
}, { timestamps: true });

/**
 * Check to see which user owns a course before modifying a course document and
 * to prevent course owner from posting reviews on their own course.
 * @param {ObjectId} userId - ID of the user attempting to modify the document
 * @return {Boolean}
 */
CourseSchema.methods.userOwnsCourse = function(userId){
  return this.user.toString() === userId.toString();
}

/**
 * Aggregate the top 10 courses in the database. Courses will need to have
 * at least 2 reviews to be considered.
 */
CourseSchema.statics.getTopRated = function(){
  return this.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'course',
        as: 'topReviews'
      }
    },
    // match where [1] index exists (at least 2 reviews)
    {
      $match: { 'topReviews.1': { $exists: true } }
    },
    // add "averageRating" field to the courses and grab a few fields from the model
    {
      $project: {
        averageRating: { $avg: '$topReviews.rating' },
        title: '$$ROOT.title',
        description: '$$ROOT.description',
        estimatedTime: '$$ROOT.estimatedTime'
      }
    },
    // sort by the new "averageRating" field
    {
      $sort: { averageRating: -1 }
    },
    // limit the results to 10
    {
      $limit: 10
    }
  ]);
}

export default mongoose.model('Course', CourseSchema);