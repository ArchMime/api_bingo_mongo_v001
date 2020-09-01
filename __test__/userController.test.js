require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { createUser, getUser } = require('../src/controller/userController')
const { secret } = require('../src/envConfig')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



describe(`user controller test createUser`, () => {
    it('should make a new user', async(done) => {

        const userTest = await createUser('mimo', 'pas1234')

        expect(userTest).not.toBeNull()
        expect(userTest).toHaveProperty('token')
        expect(userTest).toHaveProperty('user')
        done()
    });

    it('not send username', async(done) => {
        const userTest = await createUser('', 'pas1234')

        expect(userTest).not.toBeNull()
        expect(userTest).toMatchObject({ message: "userName cannot be undefined" })

        done()
    });

    it('not send password', async(done) => {
        const userTest = await createUser('mimo', '')

        expect(userTest).not.toBeNull()
        expect(userTest).toMatchObject({ message: "password cannot be undefined" })
        done()
    });

    it('duplicate userName', async(done) => {
        const userTest = await createUser('mimo', 'pas1234')
        const userTest2 = await createUser('mimo', 'pas1234')

        expect(userTest).not.toBeNull()
        expect(userTest2).not.toBeNull()
        expect(userTest).toHaveProperty('token')
        expect(userTest).toHaveProperty('user')
        expect(userTest2).toMatchObject({ message: "username not available" })

        done()
    });

})

describe('user controller test getUser', () => {
    it('get user', async(done) => {

        const userTest = await createUser('mimo', 'pas1234')

        const getUserTest = await getUser('mimo', 'pas1234')


        expect(getUserTest).not.toBeNull()
        expect(getUserTest).toHaveProperty('token')
        expect(getUserTest).toHaveProperty('user')
        done()
    });

    it('get user with a user correct and a incorrect password', async(done) => {

        const userTest = await createUser('mimo', 'pas1234')

        const getUserTest = await getUser('mimo', 'pas12345')

        expect(getUserTest).not.toBeNull()
        expect(getUserTest).not.toHaveProperty('token')
        expect(getUserTest).toMatchObject({ message: "userName or password incorrect" })

        done()
    });

    it('get user with a password correct and a incorrect userName', async(done) => {

        const userTest = await createUser('mimo', 'pas1234')

        const getUserTest = await getUser('mimo2', 'pas1234')

        expect(getUserTest).not.toBeNull()
        expect(getUserTest).not.toBeNull()
        expect(getUserTest).not.toHaveProperty('token')
        expect(getUserTest).toMatchObject({ message: "userName or password incorrect" })

        done()
    });
});