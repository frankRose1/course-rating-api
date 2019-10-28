import request from 'supertest';
import { Types } from 'mongoose';
import { createApp } from '../../src/app';
import { setupDB } from '../setup';
import User from '../../src/services/user/model';
import Category from '../../src/services/category/model';

const testUser = {
  name: 'John Smith',
  email: 'john@smith.com',
  username: 'testUser1',
  password: 'password',
  role: 'ADMIN'
};

const testUser2 = {
  name: 'Ben Wyatt',
  email: 'ben@local.com',
  username: 'testUser2',
  password: 'password'
};

describe('/api/v1/categories', () => {
  let app;
  let user;
  let user2;
  let category;
  let token;
  let token2;

  setupDB('category-api-test');

  beforeEach(async () => {
    app = createApp();
    user = new User(testUser);
    user2 = new User(testUser2);
    category = new Category({ name: 'Cooking' });
    await Promise.all([user.save(), user2.save(), category.save()]);
    token = user.generateAuthToken();
    token2 = user2.generateAuthToken();
  });

  describe('GET /', () => {
    it('should return a 200 and a list of categories', async () => {
      const category2 = await new Category({ name: 'Painting' }).save();
      const res = await request(app).get('/api/v1/categories');
      expect(res.status).toBe(200);
      expect(res.body.categories).toHaveLength(2);
      expect(
        res.body.categories.some(c => c.name === category.name)
      ).toBeTruthy();
      expect(
        res.body.categories.some(c => c.name === category2.name)
      ).toBeTruthy();
    });
  });

  describe('POST /', () => {
    it('should return a 401 if auth headers are missing', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('x-auth-token', '')
        .send({});
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized. No token provided.');
    });

    it('should return a 403 user is not an admin', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('x-auth-token', token2)
        .send({});
      expect(res.status).toBe(403);
      expect(res.body.error).toBe(
        'Admin privileges are required to access this resource.'
      );
    });

    it('should return a 400 for an invalid payload', async () => {
      const payload = { name: '' };
      const res = await request(app)
        .post('/api/v1/categories')
        .set('x-auth-token', token)
        .send(payload);
      expect(res.status).toBe(400);
    });

    it('should return a 400 if category name already exists', async () => {
      const payload = { name: 'Cooking' };
      const res = await request(app)
        .post('/api/v1/categories')
        .set('x-auth-token', token)
        .send(payload);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Category already exists.');
    });

    it('should return a 201 for a valid payload and auth token', async () => {
      const payload = { name: 'Network Security' };
      const res = await request(app)
        .post('/api/v1/categories')
        .set('x-auth-token', token)
        .send(payload);
      expect(res.status).toBe(201);
    });
  });

  describe('GET /:id', () => {
    it("should return a 404 if a category doesn't exist", async () => {
      const res = await request(app).get(
        `/api/v1/categories/${Types.ObjectId()}`
      );
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Category not found.');
    });

    it('should return a 200 for a valid ID', async () => {
      const res = await request(app).get(`/api/v1/categories/${category._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('category');
      expect(res.body.category.name).toBe(category.name);
      expect(res.body.category._id).toBe(category._id.toString());
    });
  });
});
