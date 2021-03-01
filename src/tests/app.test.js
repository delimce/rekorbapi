const app = require('../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

describe('App endpoints Test', () => {

    it('Should get a Rekorbit dashboard object', async done => {
        const crypto = ["LTC", "BTC", "ETH", "BCH", "XRP"];
        const fiat = ["USD", "EUR", "ARG", "GOLD"];
        const res = await request.post('/app/dashboard').send(
            crypto
        )
        let currencies = crypto.concat(fiat);
        let results = await res.body.map(el => {
            return el.symbol;
        });
        expect(currencies.length).toBe(results.length);
        done()
    })

    it('should get a list of prices bigger than 0', async done => {
        const res = await request.get('/app/fiat/ves/prices');
        const notCeroPrices = res.body.filter((el) => {
            return el.price > 0;
        })
        expect(notCeroPrices.length).toBe(3);
        done()
    })

})