import request from 'supertest';
import { createApp } from '../../src/app';
import { setupDB } from '../setup';
import User from '../../src/services/user/model';

// an example of how you could test api endpoints
describe('/api/v1/users', () => {
    let app;
    let user;
    let token;

    setupDB('user-api-test');

    beforeEach(async ()=>{
        app = createApp();
        user = new User({
            username: 'testUser1',
            password: 'password',
            email: 'test@local.com',
            name: 'John Smith'
        });
        await user.save();
        token = user.generateAuthToken();
    });

    describe('POST /', () => {
        it('should return a 400 for invalid username', async () => {
            const payload = {
                username: 'lo',
                password: 'password',
                email: 'test@local.com',
                name: 'John Smith'
            };
            const res = await request(app)
                .post('/api/v1/users')
                .send(payload);
            expect(res.status).toBe(400);
        });

        it('should return a 400 for username in use', async () => {
            const payload = {
                username: 'testUser1',
                password: 'password',
                email: 'test2@local.com',
                name: 'John Smith'
            };
            const res = await request(app)
                .post('/api/v1/users')
                .send(payload);
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Username is already taken.')
        });

        it('should return a 400 for email in use', async () => {
            const payload = {
                username: 'testUser2',
                password: 'password',
                email: 'test@local.com',
                name: 'John Smith'
            };
            const res = await request(app)
                .post('/api/v1/users')
                .send(payload);
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Email is already in use.')
        });

        it('should return a 201 for a valid payload', async () => {
            const payload = {
                username: 'testUser2',
                password: 'password',
                email: 'test2@local.com',
                name: 'jane Smith'
            };
            const res = await request(app)
                .post('/api/v1/users')
                .send(payload);
            const newUser = await User.findOne({ username: payload.username });
            expect(res.status).toBe(201);
            expect(res.headers.location).toBe('/api/auth');
            expect(newUser).toBeTruthy();
        });
    });

    describe('GET /', () => {
        it('should return a 401 if no token is provided', async () => {
            const res = await request(app)
                .get('/api/v1/users')
                .set('x-auth-token', '');
            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Unauthorized. No token provided.')
        });

        it('should return a 200 with auth headers properly set', async () => {
            const res = await request(app)
                .get('/api/v1/users')
                .set('x-auth-token', token);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.username).toBe(user.username);
            expect(res.body.user.email).toBe(user.email);
            expect(res.body.user.name).toBe(user.name);
            expect(res.body.user.password).toBeUndefined();
        });
    });

});