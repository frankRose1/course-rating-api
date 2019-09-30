import request from 'supertest'
import { createApp } from '../../src/app'
import { setupDB } from '../setup'

// an example of how you could test api endpoints
describe('routes', () => {
    let app;

    setupDB('api-test')

    beforeEach(()=>{
        app = createApp()
    })

    describe('not found', () => {
        it('should return a 404', async () => {
            const res = await request(app).get('/not_found')
            expect(res.status).toBe(404)
        })
    })
})