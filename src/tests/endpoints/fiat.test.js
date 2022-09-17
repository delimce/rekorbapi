
const app = require('../../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

describe('Fiat endpoints Test', () => {

  it('Should get a numeric > 0 dtoday USD price', async done => {
    // Sends GET Request to /test endpoint
    const res = await request.get('/fiat/dtoday')
    expect(Number(res.body)).toBeGreaterThan(0);
    done()
  })

  it('Should get a object dtoday with USD key', async done => {
    // Sends GET Request to /test endpoint
    const res = await (await request.get('/fiat/dtoday/dollar')).body;
    expect(res.dolartoday > 1).toBe(true);
    expect(res.transferencia > 1).toBe(true);
    done()
  })

  it('Should get a numeric > 0  dmonitor USD price', async done => {
    // Sends GET Request to /test endpoint
    const res = await request.get('/fiat/dmonitor')
    expect(Number(res.body)).toBeGreaterThan(0);
    done()
  })

  it('Should get a numeric > 0  BCV USD price', async done => {
    // Sends GET Request to /test endpoint
    const res = await request.get('/fiat/bcv')
    expect(Number(res.body)).toBeGreaterThan(0);
    done()
  })

  it('Should get a numeric > 0 ves ha price USD price', async done => {
    // Sends GET Request to /test endpoint
    const res = await request.get('/fiat/ve/ha/price')
    expect(Number(res.body)).toBeGreaterThan(0);
    done()
  })

  it('Should get array of floatrates', async done => {
    // Sends GET Request to /test endpoint
    const res = await request.get('/fiat/floatrates')
    expect(res.body.length > 1).toBeTruthy();
    done()
  })

  it('Should get array of bluelytics lenght = 2', async done => {
    // Sends GET Request to /test endpoint
    const res = await request.get('/fiat/bluelytics')
    expect(res.body.length === 2).toBeTruthy();
    done()
  })

})