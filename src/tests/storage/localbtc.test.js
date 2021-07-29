const database = require('../config/database')
const lbtcModule = require('../../modules/crypto/localbtc') // model to test
const userModule = require('../../modules/users/user') // model to test
const userFake = require('../mocking/UserMock')

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
        bank: "BANK"
    }

    it('Should insert new trade', async done => {
        let res = await lbtcModule.saveNewTrade(tradeFake)
        expect(res.success).toBe(true);
        expect(res.data._id).toBeDefined();
        done()
    })

    it('Should insert new trade with user data', async done => {
        let result = await userModule.insert(userFake)
        let dataUser = await result.data.toObject()
        let res = await lbtcModule.saveNewTradeWithUser(tradeFake,dataUser.token)
        expect(res.success).toBe(true);
        expect(res.data._id).toBeDefined();
        expect(res.data.user.get('email')).toBe(dataUser.email);
        done()
    })

    it("Should insert and get trades of user inserted", async done => {
        //create user
        let user = await userModule.insert(userFake)
        let dataUser = user.data;
        // create user's post
        await lbtcModule.saveNewTradeWithUser(tradeFake,dataUser.token)
        // get user's posts
        const res = await lbtcModule.getTradesByUser(dataUser.token);
        expect(res.success).toBe(true);
        expect(res.data.length).toBeGreaterThan(0);
        done()
    })

})