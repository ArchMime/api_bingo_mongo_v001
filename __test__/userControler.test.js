require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { createUser } = require('../src/controller/userController')
const { UserModel } = require('../src/models/userModel')
const { secret } = require('../src/envConfig')
const jwt = require('jsonwebtoken')




describe(`Create user test`, () => {
    it('should make a new user', async(done) => {

        const userTest = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        const token = jwt.sign({ id: userTest.user._id }, secret)

        expect(userTest).not.toBeNull()
        expect(userTest.token).toEqual(token)
        expect(userTest.user).toMatchObject({ userName: 'mimo', email: 'mimo@mimo.com' })

        done()
    });

    it('send invalidate email', async(done) => {
        const userTest = await createUser('mimo', 'mimo_mimo.com', 'pas1234')

        expect(userTest).not.toBeNull()
        expect(userTest).toEqual({ error: "username or email not available" })

        done()
    });

    it('not send email', async(done) => {
        const userTest = await createUser('mimo', '', 'pas1234')

        expect(userTest).not.toBeNull()
        expect(userTest).toEqual({ error: "username or email not available" })

        done()
    });

    it('not send username', async(done) => {
        const userTest = await createUser('', 'mimo@mimo.com', 'pas1234')

        expect(userTest).not.toBeNull()
        expect(userTest).toMatchObject({ message: "Invalid petition" })

        done()
    });

    it('not send password', async(done) => {
        const userTest = await createUser('mimo', 'mimo@mimo.com')

        expect(userTest).not.toBeNull()
        expect(userTest).toMatchObject({ message: "Invalid petition" })

        done()
    });

})