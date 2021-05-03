const database = require('../config/database')
const lbtcModule = require('../../modules/crypto/localbtc') // model to test
const userModule = require('../../modules/users/user') // model to test

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

    it('Should insert new trade with user data', async done => {
        let result = await userModule.insert({
            name: "test2 user",
            email: "user2@testing.com",
        })
        let dataUser = await result.data.toObject()
        let res = await lbtcModule.saveNewTradeWithUser(tradeFake,dataUser.token)
        expect(res.success).toBe(true);
        expect(res.data._id).toBeDefined();
        expect(res.data.user.get('email')).toBe(dataUser.email);
        done()
    })

})