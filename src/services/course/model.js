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


export default mongoose.model('Course', CourseSchema);