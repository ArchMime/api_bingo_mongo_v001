require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { apiVersion } = require('../src/envConfig')
const request = require('supertest')
const app = require('../src/app')

let testServer
beforeAll(async() => {
    testServer = await app.listen(4000)
})

afterAll((done) => {
    testServer.close(done)
})

describe('singin route test', () => {
    it('Create new user', async(done) => {
        const response = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', password: 'pas1234' })

        expect(response.status).toBe(201)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('token')
        expect(response.body).toHaveProperty('user')
        expect(response.error).toBe(false)
        done()
    });

    it('duplicate username for new user', async(done) => {
        const aux = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', password: 'pas1234' })

        const response = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', password: 'pas1234' })

        expect(response.status).toBe(400)
        expect(response.body).not.toBeNull()
        expect(response.body).toMatchObject({ message: 'username not available' })

        done()
    });

    it('Create multiple new user', async(done) => {
        const response = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', password: 'pas1234' })

        const response2 = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo2', password: 'pas1234' })

        const response3 = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo3', password: 'pas1234' })

        expect(response.error).toBe(false)
        expect(response.status).toBe(201)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('token')
        expect(response2.error).toBe(false)
        expect(response2.status).toBe(201)
        expect(response2.body).not.toBeNull()
        expect(response2.body).toHaveProperty('token')
        expect(response3.error).toBe(false)
        expect(response3.status).toBe(201)
        expect(response3.body).not.toBeNull()
        expect(response3.body).toHaveProperty('token')

        done()
    });

    it('Create a good user/bad user/good user/duplicate user/good user', async(done) => {
        const response = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', password: 'pas1234' })

        const response2 = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: '', password: 'pas1234' })

        const response3 = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo3', password: 'pas1234' })

        const response4 = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo3', password: 'pas1234' })

        const response5 = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo4', password: 'pas1234' })

        expect(response.error).toBe(false)
        expect(response.status).toBe(201)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('token')
        expect(response.body).toHaveProperty('user')
        expect(response2.status).toBe(400)
        expect(response2.body).not.toBeNull()
        expect(response2.body).toMatchObject({ message: 'userName cannot be undefined' })
        expect(response3.error).toBe(false)
        expect(response3.status).toBe(201)
        expect(response3.body).not.toBeNull()
        expect(response3.body).toHaveProperty('token')
        expect(response.body).toHaveProperty('user')
        expect(response4.status).toBe(400)
        expect(response4.body).not.toBeNull()
        expect(response4.body).toMatchObject({ message: 'username not available' })
        expect(response5.error).toBe(false)
        expect(response5.status).toBe(201)
        expect(response5.body).not.toBeNull()
        expect(response5.body).toHaveProperty('token')
        expect(response.body).toHaveProperty('user')

        done()
    });
});

describe('login route test', () => {
    it('send email and password', async(done) => {
        const aux = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', password: 'pas1234' })

        const response = await request(app)
            .post(`${apiVersion}/users/login`)
            .send({ userName: 'mimo', password: 'pas1234' })

        expect(response.error).toBe(false)
        expect(response.status).toBe(200)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('token')
        expect(response.body).toHaveProperty('user')

        done()
    });

    it('send bad userName and password', async(done) => {
        const aux = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', password: 'pas1234' })

        const response = await request(app)
            .post(`${apiVersion}/users/login`)
            .send({ email: 'mimo2@mimo.com', password: 'pas11234' })

        expect(response.status).toBe(400)
        expect(response.body).not.toBeNull()
        expect(response.body).toMatchObject({ message: 'userName or password incorrect' })

        done()
    });

    it('send bad credentials after good credentials', async(done) => {
        const aux = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', password: 'pas1234' })

        const response = await request(app)
            .post(`${apiVersion}/users/login`)
            .send({ userName: 'mimo2@mimo.com', password: 'pas11234' })

        const response2 = await request(app)
            .post(`${apiVersion}/users/login`)
            .send({ userName: 'mimo', password: 'pas1234' })

        expect(response.status).toBe(400)
        expect(response.body).not.toBeNull()
        expect(response.body).toMatchObject({ message: 'userName or password incorrect' })
        expect(response2.error).toBe(false)
        expect(response2.status).toBe(200)
        expect(response2.body).not.toBeNull()
        expect(response2.body).toHaveProperty('token')
        expect(response2.body).toHaveProperty('user')

        done()
    });

});