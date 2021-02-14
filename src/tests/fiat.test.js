
const app = require('../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

describe('Fiat endpoints Test', () => {
 
    it('Should get a numeric dtoday USD price', async done => {
        // Sends GET Request to /test endpoint
        const res = await request.get('/fiat/dtoday')
        expect(Number(res.body)).not.toBeNaN()
        done()
      })

      it('Should get a numeric dmonitor USD price', async done => {
        // Sends GET Request to /test endpoint
        const res = await request.get('/fiat/dmonitor')
        expect(Number(res.body)).not.toBeNaN()
        done()
      })

      it('Should get array of floatrates', async done => {
        // Sends GET Request to /test endpoint
        const res = await request.get('/fiat/floatrates')
        expect(res.body.length>1).toBeTruthy();
        done()
      })

      it('Should get array of bluelytics lenght = 2', async done => {
        // Sends GET Request to /test endpoint
        const res = await request.get('/fiat/bluelytics')
        expect(res.body.length===2).toBeTruthy();
        done()
      })

  })