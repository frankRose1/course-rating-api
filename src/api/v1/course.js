import { Router } from 'express';
import auth from '../../middleware/auth';
import isValidMongoID from '../../middleware/isValidMongoID';
import * as CourseController from '../../services/course/controller';
import { createReview } from '../../services/review/controller';

const router = Router();

router.get('/', CourseController.getCoursesList);

router.post('/', auth, CourseController.createCourse);

router.get('/:id', isValidMongoID, CourseController.getCourse);

router.put('/:id', auth, isValidMongoID, CourseController.updateCourse);

router.post('/:id/reviews', auth, isValidMongoID, createReview);

router.get('/top-rated', CourseController.getTop10CoursesList);

export default router;