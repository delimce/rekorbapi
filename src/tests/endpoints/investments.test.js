const app = require('../../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)
const database = require('../config/database');
const fakeInvest = require('../fixtures/Investment');

// prepare testing database methods
/* beforeAll(async () => database.dbConnect());
afterAll(async () => database.dbDisconnect()); */


describe("Investment's endpoints Test", () => {

    it.skip('Should create a new investment', async done => {
        // Sends GET Request to /test endpoint
        const res = await request.post('/investments/new').send(fakeInvest)
        expect(res.status).toBe(200);
        done()
    })

    
})