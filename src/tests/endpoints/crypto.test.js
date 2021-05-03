const app = require('../../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

describe('Crypto CMC endpoints Test', () => {
 
    it('Should get a crypto assets array', async done => {
        const res = await request.get('/crypto/cmc/all')
        expect(res.body.length>10).toBe(true)
        done()
      })

      it('Should get a crypto assets detail object', async done => {
        let cryptoId = "bitcoin";  
        const res = await request.get('/crypto/cmc/detail/'+cryptoId)
        expect(res.body[0].id).toBe(cryptoId)
        done()
      })

  })


  describe('Crypto GECKO endpoints Test', () => {
 
    it('Should get a crypto assets array gecko', async done => {
        const res = await request.get('/crypto/gecko/list')
        expect(res.body.length>60).toBe(true)
        done()
      })

      it('Should get a crypto prices for crypto id array passed', async done => {
        const res = await request.get('/crypto/gecko/prices').send(
            ["bitcoin","litecoin"]
        )
        let result = await res.body;
        expect(typeof result.bitcoin.usd).toBe('number')
        expect(typeof result.litecoin.usd).toBe('number')
        done()
    })

  })