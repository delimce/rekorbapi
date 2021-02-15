const app = require('../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

describe('Crypto endpoints Test', () => {
 
    it('Should get a crypto assets array CMC', async done => {
        const res = await request.get('/crypto/cmc/all')
        expect(res.body.length>10).toBe(true)
        done()
      })

      it('Should get a crypto assets detail object CMC', async done => {
        let cryptoId = "bitcoin";  
        const res = await request.get('/crypto/cmc/detail/'+cryptoId)
        expect(res.body[0].id).toBe(cryptoId)
        done()
      })

  })