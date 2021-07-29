const database = require('../config/database')
const userModule = require('../../modules/users/user') // model to test
const userFake = require('../mocking/UserMock')

describe('Users module database Test', () => {

    // prepare testing database methods
    beforeAll(async () => database.dbConnect());
    afterAll(async () => database.dbDisconnect());

    it('Should insert new User', async done => {
        let res = await userModule.insert(userFake)
        expect(res.success).toBe(true);
        expect(res.data._id).toBeDefined();
        expect(res.data.token).not.toBe(null);
        expect(res.data.password).not.toEqual(userFake.password);
        done()
    })

    it('Should to activate an user', async done => {
        let result = await userModule.insert(userFake)
        let data = await result.data;
        await userModule.activate(data.email, data.token)
        let myUser = await userModule.getById(data._id);
        let isActive = await userModule.isActive(myUser.token)
        expect(isActive).toBe(true);
        done()
    })

    it('Should insert activate and check Login', async done => {
        userFake.active = true;
        let newUser = await userModule.insert(userFake)
        let result = await userModule.login(newUser.data.email, userFake.password)
        expect(result.success).toBe(true);
        done()
    })

    it('Should generate new temporally password', async done => {
        userFake.active = true;
        let newUser = await userModule.insert(userFake);
        let result = await userModule.rememberPassword(newUser.data.email);
        expect(result.success).toBe(true);
        expect(result.data.password).not.toBe(undefined);
        done()
    })

})