const app = require('../../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)
const countries = require('../../../public/enums/countries.json')
describe('App endpoints Test', () => {

    it('Should get a Rekorbit dashboard object', async done => {
        const data = {
            coinList: ["LTC", "BTC", "ETH", "BCH", "XRP"],
            vesOption: "BCV"
        };
        const fiat = ["USD", "EUR", "ARG", "GOLD"];
        const res = await request.post('/app/dashboard').send(
            data
        )
        const currencies = data.coinList.concat(fiat);
        const pricesVes = res.body.prices;

        expect(currencies.length).toBe(res.body.coins.length);
        expect(countries.length).toBe(res.body.countries.length);
        expect(pricesVes.length).toBeGreaterThanOrEqual(1);
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