import request from 'supertest';
import { Types } from 'mongoose';
import _app from '../../src/app';
import { setupDB } from '../setup';
import Course from '../../src/services/course/model';
import Review from '../../src/services/review/model';
import User from '../../src/services/user/model';
import Category from '../../src/services/category/model';

const testUser = {
  name: 'John Smith',
  email: 'john@smith.com',
  username: 'testUser1',
  _id: Types.ObjectId(),
  password: 'password'
};

const testUser2 = {
  name: 'Ben Wyatt',
  email: 'ben@local.com',
  username: 'testUser2',
  password: 'password'
};

const testCategory = {
  _id: Types.ObjectId(),
  name: 'Software Development'
};

const testCourse1 = {
  title: 'First Test Course',
  user: testUser._id,
  category: testCategory._id,
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
  category: testCategory._id,
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
  let user2;
  let course1;
  let course2;
  let category;
  let token;
  let token2;

  setupDB('course-api-test');

  beforeEach(async () => {
    app = _app;
    user = new User(testUser);
    user2 = new User(testUser2);
    category = new Category(testCategory);
    await Promise.all([user.save(), user2.save(), category.save()]);
    course1 = new Course(testCourse1);
    course2 = new Course(testCourse2);
    await Promise.all([course1.save(), course2.save()]);
    token = user.generateAuthToken();
    token2 = user2.generateAuthToken();
  });

  describe('GET /', () => {
    it('should return a 200 & a list of courses in the database', async () => {
      const res = await request(app).get('/api/v1/courses');
      expect(res.status).toBe(200);
      expect(res.body.courses).toHaveLength(2);
      expect(
        res.body.courses.some(c => c.title === testCourse1.title)
      ).toBeTruthy();
      expect(
        res.body.courses.some(c => c.title === testCourse2.title)
      ).toBeTruthy();
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

  describe('PUT /:id', () => {
    it('should return a 401 for missing auth token', async () => {
      const res = await request(app)
        .put(`/api/v1/courses/${course1._id}`)
        .set('x-auth-token', '')
        .send({});
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized. No token provided.');
    });

    it("should return a 404 for a course that doesn't exist", async () => {
      const res = await request(app)
        .put(`/api/v1/courses/${Types.ObjectId()}`)
        .set('x-auth-token', token)
        .send({});
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Course not found.');
    });

    it("should return a 403 if user didn't create the course", async () => {
      const res = await request(app)
        .put(`/api/v1/courses/${course1._id}`)
        .set('x-auth-token', token2)
        .send({});
      expect(res.status).toBe(403);
      expect(res.body.error).toBe(
        'Only the owner of this course can make updates.'
      );
    });

    it('should return a 400 for an invalid payload', async () => {
      const payload = {
        steps: [
          {
            title: 'too short',
            description: ''
          }
        ]
      };
      const res = await request(app)
        .put(`/api/v1/courses/${course1._id}`)
        .set('x-auth-token', token)
        .send(payload);
      expect(res.status).toBe(400);
    });

    it('should return a 404 for category that doesnt exist', async () => {
      const payload = {
        title: 'Brand New Course',
        estimatedTime: '6 hours',
        description: 'Testing testing 123',
        category: Types.ObjectId()
      };
      const res = await request(app)
        .put(`/api/v1/courses/${course1._id}`)
        .set('x-auth-token', token)
        .send(payload);
      expect(res.status).toBe(404);
    });

    it('should return a 204 and set location headers for valid payload and ID', async () => {
      const payload = {
        ...testCourse2,
        title: 'Updated title',
        description: 'This is an updated description'
      };
      const res = await request(app)
        .put(`/api/v1/courses/${course2._id}`)
        .set('x-auth-token', token)
        .send(payload);
      expect(res.status).toBe(204);
      expect(res.headers.location).toBe(`/api/v1/courses/${course2._id}`);
      const updatedCourse = await Course.findById(course2._id);
      expect(updatedCourse.title).toBe(payload.title);
      expect(updatedCourse.description).toBe(payload.description);
    });
  });

  describe('POST /', () => {
    it('should return a 401 for missing auth token', async () => {
      const res = await request(app)
        .post('/api/v1/courses')
        .set('x-auth-token', '')
        .send({});
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized. No token provided.');
    });

    it('should return a 400 for invalid payload', async () => {
      const payload = {
        materialsNeeded: 'blah blah',
        steps: [
          {
            stepNumber: 1,
            title: 'What is GraphQL',
            description:
              'GraphQL is a query language that makes querying much cleaner and faster...'
          }
        ]
      };
      const res = await request(app)
        .post('/api/v1/courses')
        .set('x-auth-token', token)
        .send(payload);
      expect(res.status).toBe(400);
    });

    it("should return a 404 if a selected category doesn't exist", async () => {
      const payload = {
        title: 'Brand New Course',
        estimatedTime: '6 hours',
        description: 'Testing testing 123',
        category: Types.ObjectId()
      };
      const res = await request(app)
        .post('/api/v1/courses')
        .set('x-auth-token', token)
        .send(payload);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("The category you chose doesn't exist.");
    });

    it('should return a 201 for a valid payload and auth token', async () => {
      const payload = {
        title: 'Learn To Paint',
        estimatedTime: '20 hours',
        description:
          'Unleash your inner artist with this painting master class',
        category: category._id
      };
      const res = await request(app)
        .post('/api/v1/courses')
        .set('x-auth-token', token)
        .send(payload);
      expect(res.status).toBe(201);
    });
  });

  describe('POST /:id/reviews', () => {
    it('should return a 401 for a missing auth token', async () => {
      const res = await request(app)
        .post(`/api/v1/courses/${course1._id}/reviews`)
        .set('x-auth-token', '')
        .send({});
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized. No token provided.');
    });

    it("should return a 404 for a course that doesn't exist", async () => {
      const payload = {
        rating: 5,
        description: 'This course is the best!'
      };
      const res = await request(app)
        .post(`/api/v1/courses/${Types.ObjectId()}/reviews`)
        .set('x-auth-token', token)
        .send(payload);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Course not found.');
    });

    it('should return a 403 if user tries to review their own course', async () => {
      const payload = {
        rating: 5,
        description: 'This course is the best!'
      };
      const res = await request(app)
        .post(`/api/v1/courses/${course1._id}/reviews`)
        .set('x-auth-token', token)
        .send(payload);
      expect(res.status).toBe(403);
      expect(res.body.error).toBe(
        "You can't leave a review on your own course."
      );
    });

    it('should return a 400 for an invalid payload', async () => {
      const res = await request(app)
        .post(`/api/v1/courses/${course1._id}/reviews`)
        .set('x-auth-token', token2)
        .send({});
      expect(res.status).toBe(400);
    });

    it('should return a 403 if a user already left a review on a course', async () => {
      const review = {
        user: user2._id,
        course: course1._id,
        rating: 5
      };
      await Review.collection.insertOne(review);
      const payload = {
        rating: 2,
        description: 'Trying to leave another review.'
      };
      const res = await request(app)
        .post(`/api/v1/courses/${course1._id}/reviews`)
        .set('x-auth-token', token2)
        .send(payload);
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("You can't review the same course twice.");
    });

    it('should return a 201 for a valid payload and auth token', async () => {
      const payload = {
        rating: 4,
        description: 'This course is cool.'
      };
      const res = await request(app)
        .post(`/api/v1/courses/${course1._id}/reviews`)
        .set('x-auth-token', token2)
        .send(payload);
      expect(res.status).toBe(201);
      expect(res.headers.location).toBe(`/api/v1/courses/${course1._id}`);
    });
  });
});
