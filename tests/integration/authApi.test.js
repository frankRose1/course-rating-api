import request from 'supertest';
import { createApp } from '../../src/app';
import { setupDB } from '../setup';
import User from '../../src/services/user/model';

// an example of how you could test api endpoints
describe('/api/auth', () => {
    let app;
    let user;

    setupDB('auth-api-test');

    beforeEach(async ()=>{
        app = createApp();
        user = new User({
            name: 'Jane Smith',
            username: 'testUser1',
            email: 'test@test.com',
            password: 'password'
          });
        await user.save();
    });

    describe('POST /', () => {
        it('should return a 400 for invalid username', async () => {
            const payload = {
                username: 'lo',
                password: 'password'
            };
            const res = await request(app)
                .post('/api/auth')
                .send(payload);
            expect(res.status).toBe(400);
        });

        it('should return a 400 for invalid password', async () => {
            const payload = {
                username: 'testUser1',
                password: 'pa'
            };
            const res = await request(app)
                .post('/api/auth')
                .send(payload);
            expect(res.status).toBe(400);
        });

        it('should return a 400 if username doesn\'t exist', async () => {
            const payload = {
                username: 'doesntExist',
                password: 'password'
            };
            const res = await request(app)
                .post('/api/auth')
                .send(payload);
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Invalid username or password.')
        });

        it('should return a 400 if user provides incorrect password.', async () => {
            const payload = {
                username: 'testUser1',
                password: 'wrongPassword'
            };
            const res = await request(app)
                .post('/api/auth')
                .send(payload);
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Invalid username or password.')
        });

        it('should return a 200 and a token for correct credentials', async () => {
            const payload = {
                username: 'testUser1',
                password: 'password'
            };
            const res = await request(app)
                .post('/api/auth')
                .send(payload);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        });
    });

});