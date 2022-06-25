const database = require('../config/database')
const investmentModule = require('../../modules/crypto/investment') // model to test
const investmentFake = require('../fixtures/Investment')

describe("Investments module testing", () => {
    // prepare testing database methods
    beforeAll(async () => database.dbConnect());
    afterAll(async () => database.dbDisconnect());

    it('Should insert new investment', async done => {
        let res = await investmentModule.create(investmentFake)
        expect(res.success).toBe(true);
        expect(res.data._id).toBeDefined();
        done()
    })

    it('Should delete an investment', async done => {
        let res = await investmentModule.create(investmentFake)
        let investId = res.data._id;
        let res2 = await investmentModule.deleteById(investId)
        expect(res2.success).toBe(true);

        let deleted = await investmentModule.getById(investId)
        expect(deleted).toBe(null);
        done()
    })

});
