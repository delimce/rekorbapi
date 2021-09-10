const database = require('../config/database')
const userModule = require('../../modules/users/user') // model to test
const userFake = require('../mocking/UserMock')

describe('Users module database Test', () => {

    // prepare testing database methods
    beforeAll(async () => database.dbConnect());
    afterAll(async () => database.dbDisconnect());

    it('Should insert new User', async done => {
        let userPass = userFake.password
        let res = await userModule.insert(userFake)
        expect(res.success).toBe(true);
        expect(res.data._id).toBeDefined();
        expect(res.data.token).not.toBe(null);
        expect(res.data.password).not.toBe(userPass);
        done()
    })

    it('Should to activate an user', async done => {
        let result = await userModule.getOrCreateUserByEmail(userFake)
        let data = await result.data;
        await userModule.activate(data.email, data.token)
        let myUser = await userModule.getById(data._id);
        let isActive = await userModule.isActive(myUser.token)
        expect(isActive).toBe(true);
        done()
    })

    it('Should check Login with activate user', async done => {
        let myUser = await userModule.getOrCreateUserByEmail(userFake)
        let result = await userModule.login(myUser.data.email, userFake.password)
        expect(result.success).toBe(true);
        done()
    })

    it('Should generate new temporally password', async done => {
        let newUser = await userModule.getOrCreateUserByEmail(userFake);
        let result = await userModule.rememberPassword(newUser.data.email);
        expect(result.success).toBe(true);
        expect(result.data.password).not.toBe(undefined);
        done()
    })

    it('Should find a save user error', async done => {
        let errorMessage1 = "some strange error"
        let messageResult1 = userModule.savingErrorsHandler(errorMessage1);
        let errorMessage2 = "E11000 error"
        let messageResult2 = userModule.savingErrorsHandler(errorMessage2);
        expect(messageResult2).not.toBe("unexpected error");
        expect(messageResult1).toBe("unexpected error");
        done()
    })

})