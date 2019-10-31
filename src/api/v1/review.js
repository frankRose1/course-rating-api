import { Router } from 'express';
import auth from '../../middleware/auth';
import isValidMongoID from '../../middleware/isValidMongoID';
import * as ReviewController from '../../services/review/controller';

const router = Router();

router.get('/:id', isValidMongoID, ReviewController.getReview);

router.put('/:id', auth, isValidMongoID, ReviewController.updateReview);

export default router;
