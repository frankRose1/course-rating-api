import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'You must provide a course title.']
      },
      user: {
        type: mongoose.Schema.ObjectId,
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
 * @param {String} userId - ID of the user attempting to modify the document
 * @return {Boolean}
 */
CourseSchema.methods.userOwnsCourse = function(userId){
  return this.user.toString() === userId;
}

//TODO agrregate top 10 courses once reviews are enabled
CourseSchema.statics.getTopRated = function(){
  return this.aggregate([]);
}

export default mongoose.model('Course', CourseSchema);