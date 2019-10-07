import mongoose from 'mongoose';
import auth from '../../middleware/auth';

const Course = mongoose.model('Course');
const Review = mongoose.model('Review');

export default [
    {
        path: '/api/courses',
        method: 'get',
        handler: async (req, res) => {}
    },
    {
        path: '/api/courses',
        method: 'post',
        handler: [
            auth,
            async (req, res) => {}
        ]
    },
    {
        path: '/api/courses/:id',
        method: 'get',
        handler: async (req, res) => {}
    },
    {
        path: '/api/courses/:id',
        method: 'put',
        handler: [
            auth,
            async (req, res) => {}
        ]
    },
]