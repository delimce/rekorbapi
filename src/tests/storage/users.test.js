const database = require('../config/database')
const userModule = require('../../modules/users/user') // model to test

describe('Users module database Test', () => {

    // prepare testing database methods
    beforeAll(async () => database.dbConnect());
    afterAll(async () => database.dbDisconnect());


    const userFake = {
        name: "user",
        surname: "test",
        email: "user@testing.com",
        password: "P4$$w0rd."
    }

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

})