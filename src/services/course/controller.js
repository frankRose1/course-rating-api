import mongoose from 'mongoose';
import { validateCreateUpdateCourse } from '../../utils/validation';

const Course = mongoose.model('Course');
const Review = mongoose.model('Review');

export const getCoursesList = async (req, res) => {};

export const getTop10CoursesList = async (req, res) => {
    const courses = await Course.getTopRated();
    res.json({
        courses,
        message: `Top ${courses.length} courses!`
    });
};

export const createCourse = async (req, res) => {};

export const getCourse = async (req, res) => {};

export const updateCourse = async (req, res) => {};
