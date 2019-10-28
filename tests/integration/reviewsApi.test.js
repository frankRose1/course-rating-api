import request from 'supertest';
import { Types } from 'mongoose';
import { createApp } from '../../src/app';
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

const testCourse = {
  title: 'First Test Course',
  user: testUser._id,
  _id: Types.ObjectId(),
  description: 'Lets learn how to test a node app!',
  estimatedTime: '2 hours',
  category: testCategory._id
};

const testReview = {
  rating: 4,
  description: 'It was a great course!!',
  user: testUser._id,
  course: testCourse._id
};

describe('/api/v1/reviews', () => {
  let app;
  let user;
  let user2;
  let course;
  let review;
  let category;
  let token;
  let token2;

  setupDB('review-api-test');

  beforeEach(async () => {
    app = createApp();
    user = new User(testUser);
    user2 = new User(testUser2);
    category = new Category(testCategory);
    await Promise.all([user.save(), user2.save(), category.save()]);
    course = await new Course(testCourse).save();
    review = await new Review(testReview).save();
    token = user.generateAuthToken();
    token2 = user2.generateAuthToken();
  });

  describe('GET /:id', () => {
    it("should return a 404 if a review doesn't exist", async () => {
      const res = await request(app).get(`/api/v1/reviews/${Types.ObjectId()}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Review not found.');
    });

    it('should return a 200 for a valid ID', async () => {
      const res = await request(app).get(`/api/v1/reviews/${review._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('review');
      expect(res.body.review.rating).toBe(review.rating);
      expect(res.body.review.course._id).toBe(course._id.toString());
      expect(res.body.review.user.username).toBe(user.username);
      expect(res.body.review.user.password).toBeUndefined();
    });
  });

  describe('PUT /:id', () => {
    it('should return a 401 for missing auth headers', async () => {
      const res = await request(app)
        .put(`/api/v1/reviews/${review._id}`)
        .set('x-auth-token', '')
        .send({});
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized. No token provided.');
    });

    it("should return a 404 if review doesn't exist", async () => {
      const res = await request(app)
        .put(`/api/v1/reviews/${Types.ObjectId()}`)
        .set('x-auth-token', token)
        .send({});
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Review not found.');
    });

    it('should return a 403 if user did not create the review', async () => {
      const res = await request(app)
        .put(`/api/v1/reviews/${review._id}`)
        .set('x-auth-token', token2)
        .send({});
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Only the review author can make updates.');
    });

    it('should return a 400 for invalid payload', async () => {
      const payload = {
        rating: 7,
        description: 'blah'
      };
      const res = await request(app)
        .put(`/api/v1/reviews/${review._id}`)
        .set('x-auth-token', token)
        .send(payload);
      expect(res.status).toBe(400);
    });

    it('should return a 204 and set location headers for valid payload and auth token', async () => {
      const payload = {
        rating: 3,
        description: 'this is a new description'
      };
      const res = await request(app)
        .put(`/api/v1/reviews/${review._id}`)
        .set('x-auth-token', token)
        .send(payload);
      expect(res.status).toBe(204);
      expect(res.headers.location).toBe(`/api/v1/reviews/${review._id}`);
    });
  });
});
