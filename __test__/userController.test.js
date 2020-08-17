require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { createUser, getUser } = require('../src/controller/userController')
const { secret } = require('../src/envConfig')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



describe(`user controller test createUser`, () => {
    it('should make a new user', async(done) => {

        const userTest = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        const token = jwt.sign({ id: userTest.user._id }, secret)
        pass = await bcrypt.compare('pas1234', userTest.user.password)

        expect(userTest).not.toBeNull()
        expect(userTest.token).toEqual(token)
        expect(pass).toBeTruthy()
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

    it('duplicate userName', async(done) => {
        const userTest = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        const userTest2 = await createUser('mimo', 'mimo2@mimo.com', 'pas1234')

        expect(userTest).not.toBeNull()
        expect(userTest2).not.toBeNull()
        expect(userTest2).toEqual({ error: "username or email not available" })

        done()
    });

    it('duplicate email', async(done) => {
        const userTest = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        const userTest2 = await createUser('mimo2', 'mimo@mimo.com', 'pas1234')

        expect(userTest).not.toBeNull()
        expect(userTest2).not.toBeNull()
        expect(userTest2).toEqual({ error: "username or email not available" })

        done()
    });
})

describe('user controller test getUser', () => {
    it('get user whith email and password', async(done) => {

        const userTest = await createUser('mimo', 'mimo@mimo.com', 'pas1234')

        const getUserTest = await getUser('mimo@mimo.com', 'pas1234')

        const token = jwt.sign({ id: userTest.user._id }, secret)

        expect(getUserTest).not.toBeNull()
        expect(getUserTest).toHaveProperty('token')
        expect(getUserTest).toHaveProperty('user')
        expect(getUserTest.token).toEqual(token)
        expect(getUserTest.user).toMatchObject({ userName: 'mimo' })

        done()
    });

    it('get user with a email correct and a incorrect password', async(done) => {

        const userTest = await createUser('mimo', 'mimo@mimo.com', 'pas1234')

        const getUserTest = await getUser('mimo@mimo.com', 'pas12345')

        const token = jwt.sign({ id: userTest.user._id }, secret)

        expect(getUserTest).not.toBeNull()
        expect(getUserTest).not.toHaveProperty('token')
        expect(getUserTest).not.toHaveProperty('user')
        expect(getUserTest).toMatchObject({ message: "email or password incorrect" })

        done()
    });

    it('get user with a password correct and a incorrect email', async(done) => {

        const userTest = await createUser('mimo', 'mimo@mimo.com', 'pas1234')

        const getUserTest = await getUser('mimo2@mimo.com', 'pas12345')

        const token = jwt.sign({ id: userTest.user._id }, secret)

        expect(getUserTest).not.toBeNull()
        expect(getUserTest).not.toBeNull()
        expect(getUserTest).not.toHaveProperty('token')
        expect(getUserTest).not.toHaveProperty('user')
        expect(getUserTest).toMatchObject({ message: "Invalid data" })

        done()
    });
});