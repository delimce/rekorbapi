const app = require('../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

describe('Trades endpoints Test', () => {

    it('Should get a localbtc posts array by currency', async done => {
        let currency = 'usd';
        const res = await request.get('/trades/localbtc/posts/currency/' + currency).send({
            "type": "sell",
            "page": "1",
            "location": "us",
            "amount": 100,
            "bank": ""
        })
        expect(res.body.length > 1).toBe(true)
        done()
    })


    it.skip('Should get a localbtc posts array by location', async done => {
        let location = 've';
        const res = await request.get('/trades/localbtc/posts/location/' + location).send(
            {
                "type":"buy",
                "page":"1",
                "currency":"ves",
                "amount":10000000,
                "bank":""
            }
        )
        expect(res.body.length > 1).toBe(true)
        done()
    })

})