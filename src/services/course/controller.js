import mongoose from 'mongoose';
import { validateCreateUpdateCourse } from '../../utils/validation';
import {
    HTTP400Error,
    HTTP403Error,
    HTTP404Error
} from '../../utils/httpErrors';

const Course = mongoose.model('Course');
const Review = mongoose.model('Review');
const COURSE_NOT_FOUND = 'Course not found.'

export const getCoursesList = async (req, res) => {};

export const getTop10CoursesList = async (req, res) => {
    const courses = await Course.getTopRated();
    res.json({
        courses,
        message: `Top ${courses.length} courses!`
    });
};

export const createCourse = async (req, res) => {
    const { error, value } = validateCreateUpdateCourse(req.body);
    
    if (error) {
        throw new HTTP400Error(error.details);
    }

    const course = new Course({
        ...value,
        user: req.user._id
    });
    await course.save();

    res
      .location(`/api/v1/courses/${course._id}`)
      .sendStatus(201);
};

export const getCourse = async (req, res) => {
    const coursePromise = Course.findById(id).populate('user', '-_id name username avatar');
    const reviewsPromise = Review
        .find({ course: req.params.id })
        .select('rating description user createdAt')
        .populate('user', '-_id name username avatar')
        .sort({createdAt: -1});
    
    const [ course, reviews ] = await Promise.all([ coursePromise, reviewsPromise ]);

    if (!course) {
        throw new HTTP404Error(COURSE_NOT_FOUND);
    }

    res.json({ course, reviews });
};

export const updateCourse = async (req, res) => {
   const { id } = req.params;

   const course = await Course.findById(id);

   if (!course) {
       throw new HTTP404Error(COURSE_NOT_FOUND);
   }

   const hasPermission = course.userOwnsCourse(req.user._id);
   if (!hasPermission) {
       throw new HTTP403Error('Only the owner of this course can make updates.');
   }

   const { error, value } = validateCreateUpdateCourse(req.body);

   if (error) {
       throw new HTTP400Error(error.details);
   }

   course.set(value);
   await course.save();

   res
     .location(`/api/v1/courses/${course._id}`)
     .sendStatus(204)
};
