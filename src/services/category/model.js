import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'A category name is required'],
    unique: true
  }
});

CategorySchema.index({
  name: 'text'
});

export default mongoose.model('Category', CategorySchema);
