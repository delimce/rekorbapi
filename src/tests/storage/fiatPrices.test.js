const database = require('../config/database')
const pricesModule = require('../../modules/fiat/prices') // model to test

describe("Fiat prices module testing", () => {
    // prepare testing database methods
    beforeAll(async () => database.dbConnect());
    afterEach(async () => {
        await pricesModule.deleteAll(); 
    });
    afterAll(async () => database.dbDisconnect());

    let price = {
        currency: "ves",
        price: 4000000.10,
        source: "some source"
    }
    
    const code = 'BCV';
    
    it('Should insert new price', async done => {
        let res = await pricesModule.newOrUpdate(code, price)
        expect(res.code).toBe(code);
        expect(res._id).toBeDefined();
        done()
    })

    it('Should retrieve the price by code', async done => {
        price.code = 'MONITOR'
        await pricesModule.insert(price)

        let res = await pricesModule.getByCode(price.code)
        expect(res.code).toBe(price.code);
        expect(res._id).toBeDefined();
        done()
    })


})  