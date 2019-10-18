import request from 'supertest';
import { Types } from 'mongoose';
import { createApp } from '../../src/app';
import { setupDB } from '../setup';
import Course from '../../src/services/course/model';
import Review from '../../src/services/review/model';
import User from '../../src/services/user/model';

const testUser = {
    name: 'John Smith',
    email: 'john@smith.com',
    username: 'testUser1',
    _id: Types.ObjectId(),
    password: 'password'
};
  
const testCourse1 = {
    title: 'First Test Course',
    user: testUser._id,
    _id: Types.ObjectId(),
    description: 'Lets learn how to test a node app!',
    estimatedTime: '2 hours',
    materialsNeeded: 'Code editor, testing documentation',
    steps: [
      {
        stepNumber: 1,
        title: 'Testing your API',
        description: 'First you will need to install dev dependencies...'
      },
      {
        stepNumber: 2,
        title: 'Settting up Testing Environment',
        description:
          'Environment variables in Node can be used to set up a testing env...'
      }
    ]
};
  
const testCourse2 = {
    title: 'Node & GraphQL',
    user: testUser._id,
    description: "Learn how to start building your API's with Node and GraphQL!",
    estimatedTime: '15 hours',
    steps: [
      {
        stepNumber: 1,
        title: 'What is GraphQL',
        description:
          'GraphQL is a query language that makes querying much cleaner and faster...'
      }
    ]
};

describe('/api/v1/courses', () => {
    let app;
    let user;
    let course1;
    let course2;

    setupDB('course-api-test');

    beforeEach(async ()=>{
        app = createApp();
        user = new User(testUser);
        await user.save();
        course1 = new Course(testCourse1);
        course2 = new Course(testCourse2);
        await Promise.all([ course1.save(), course2.save() ]);
    });

    describe('GET /', () => {
        it('should return a 200 & a list of courses in the database', async () => {
            const res = await request(app).get('/api/v1/courses');
            expect(res.status).toBe(200);
            expect(res.body.courses).toHaveLength(2);
            expect(res.body.courses.some(c => c.title === testCourse1.title)).toBeTruthy();
            expect(res.body.courses.some(c => c.title === testCourse2.title)).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it("should return a 404 for a course that doesn't exist", async () => {
            const nonExistingId = Types.ObjectId();
            const res = await request(app).get(`/api/v1/courses/${nonExistingId}`);
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Course not found.');
          });

        it('should return a 200 and a course for a valid ID', async () => {
          const res = await request(app).get(`/api/v1/courses/${course1._id}`);
          expect(res.status).toBe(200);
          expect(res.body.course._id).toBe(course1._id.toHexString());
          expect(res.body.course.user.username).toBe(user.username);
          expect(res.body.course.estimatedTime).toBe(course1.estimatedTime);
          expect(res.body.course.title).toBe(course1.title);
        });
    
      });

    describe('POST /', () => {
        it('should return a 401 for missing auth token', async () => {
            const payload = {};
            const res = await request(app)
                .post('/api/v1/courses')
                .set('x-auth-token', '')
                .send(payload);
            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Unauthorized. No token provided.')
        });

        // it('should return a 400 for invalid payload', async () => {
        //     const payload = {
        //         materialsNeeded: 'blah blah',
        //         steps: [
        //           {
        //             stepNumber: 1,
        //             title: 'What is GraphQL',
        //             description:
        //               'GraphQL is a query language that makes querying much cleaner and faster...'
        //           }
        //         ]
        //     };
        //     const res = await request(app)
        //         .post('/api/v1/courses')
        //         .send(payload);
        //     expect(res.status).toBe(400);
        // });
    });

});