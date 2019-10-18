import mongoose from 'mongoose';
import {
    HTTP400Error,
    HTTP403Error,
    HTTP404Error
} from '../../utils/httpErrors';
import { validateCreateUpdateReview } from '../../utils/validation';

const Course = mongoose.model('Course');
const Review = mongoose.model('Review');

export const createReview  = async (req, res) => {
  const userId = req.user._id;
  const courseId = req.params.id;

  const course = await Course.findById(courseId);

  if (!course) {
    throw new HTTP404Error('Course not found.');
  }

  const userCreatedThisCourse = course.userOwnsCourse(userId);

  if (userCreatedThisCourse) {
    throw new HTTP403Error('You can\'t leave a review on your own course.')
  }

  const { error, value } = validateCreateUpdateReview(req.body);

  if (error) {
    throw new HTTP400Error(error.details);
  }

  const existingReview = await Review.findOne({ course: courseId, user: userId });

  if (existingReview) {
    throw new HTTP403Error('You can\'t review the same course twice.');
  }

  const review = new Review({
    ...value,
    user: userId,
    course: courseId
  });
  await review.save();

  res
    .location(`/api/v1/courses/${course._id}`)
    .sendStatus(201);
};

export const getReview = async (req, res) => {
  const review = await Review.findById(req.params.id)
  .populate('user', '-_id username name avatar')
  .populate('course', 'title estimatedTime');

  if (!review) {
      throw new HTTP404Error('Review not found.');
  }

  res.json({ review });
};

export const updateReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) {
    throw new HTTP404Error('Review not found.');
  }

  const hasPermission = review.hasPermission(req.user.id);
  
  if (!hasPermission) {
    throw new HTTP403Error('Only the review author can make updates.')
  }

  const { error, value } = validateCreateUpdateReview(req.body);

  if (error) {
    throw new HTTP400Error(error.details);
  }

  review.rating = value.rating;
  review.description = value.description;
  await review.save();
  res
    .location(`/api/v1/reviews/${review._id}`)
    .sendStatus(204);
};