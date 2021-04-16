const database = require('../config/database')
const lbtcModule = require('../../modules/crypto/localbtc') // model to test

describe('localbtc module database Test', () => {

    // prepare testing database methods
    beforeAll(async () => database.dbConnect());
    afterAll(async () => database.dbDisconnect());

    const tradeFake = {
        type: "BUY",
        currency: "ves",
        location: "ve",
        amount: 40000000,
        fee: "2",
        bank: "mercantil"
    }

    it('Should insert new trade', async done => {
        let res = await lbtcModule.saveNewTrade(tradeFake)
        expect(res.success).toBe(true);
        expect(res.data._id).toBeDefined();
        done()
    })

})