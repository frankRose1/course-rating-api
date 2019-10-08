import mongoose from 'mongoose';
import {
    HTTP403Error,
    HTTP404Error
} from '../../utils/httpErrors';

const Review = mongoose.model('Review');

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

    review.rating = req.body.rating;
    review.review = req.body.review;
    await review.save();
    res.location(`/api/v1/reviews/${review._id}`).sendStatus(204);
};