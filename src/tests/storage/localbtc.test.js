const database = require('../config/database')
const lbcModule = require('../../modules/crypto/localbtc') // model to test
const userModule = require('../../modules/users/user') // model to test
const userFake = require('../mocking/UserMock')
const tradeFake = require('../mocking/TradeFake')

describe('localBtc module database Test', () => {

    // prepare testing database methods
    beforeAll(async () => database.dbConnect());
    afterAll(async () => database.dbDisconnect());

    it('Should insert new trade', async done => {
        let res = await lbcModule.saveNewTrade(tradeFake)
        expect(res.success).toBe(true);
        expect(res.data._id).toBeDefined();
        done()
    })

    it('Should insert new trade with user data', async done => {
        let result = await userModule.insert(userFake)
        let res = {}
        let dataUser = {}
        if (result.success) {
            dataUser = await result.data.toObject()
            res = await lbcModule.saveNewTradeWithUser(tradeFake, dataUser.token)
        }
        expect(res.success).toBe(true);
        expect(res.data._id).toBeDefined();
        expect(res.data.user.get('email')).toBe(dataUser.email);
        done()
    })

    it("Should insert and get trades of user inserted", async done => {
        let user = await userModule.getOrCreateUserByEmail(userFake)
        let dataUser = user.data;
        // create user's post
        await lbcModule.saveNewTradeWithUser(tradeFake, dataUser.token)
        // get user's posts
        const res = await lbcModule.getTradesByUser(dataUser.token);
        expect(res.success).toBe(true);
        expect(res.data.length).toBeGreaterThan(0);
        done()
    })

})