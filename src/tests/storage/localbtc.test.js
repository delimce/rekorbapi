const database = require('../config/database')
const lbcModule = require('../../modules/crypto/localbtc') // model to test
const userModule = require('../../modules/users/user') // model to test
const userFake = require('../fixtures/UserMock')
const tradeFake = require('../fixtures/TradeFake')

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
        let result = await userModule.getOrCreateUserByEmail(userFake)
        let res = {}
        let dataUser = {}
        if (result.success) {
            dataUser = await result.data.toObject()
            res = await lbcModule.saveNewTradeWithUser(tradeFake, dataUser.token)
        }

        const values = [res.success,res.data.user.get('email')]
        const assertions = [true,dataUser.email]
        expect(values).toEqual(assertions);
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

    it("Should insert and delete register by id", async done => {
        let user = await userModule.getOrCreateUserByEmail(userFake)
        let dataUser = user.data;
        // create user's post
        let newTrade = await lbcModule.saveNewTradeWithUser(tradeFake, dataUser.token)
        let lastId = newTrade.data.id;
        let res = await lbcModule.deleteTradeById(lastId);
        expect(res.success).toBe(true);
        done();
    })

})