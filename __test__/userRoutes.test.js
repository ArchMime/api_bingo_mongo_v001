require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { secret, apiVersion } = require('../src/envConfig')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
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
            .send({ userName: 'mimo', email: 'mimo@mimo.com', password: 'pas1234' })

        expect(response.status).toBe(201)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('token')
        expect(response.error).toBe(false)
        done()
    });


    it('bad email for new user', async(done) => {
        const response = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', email: 'mimo_mimo.com', password: 'pas1234' })

        expect(response.status).toBe(400)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toEqual("username or email not available")

        done()
    });

    it('duplicate username for new user', async(done) => {
        const aux = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', email: 'mimo@mimo.com', password: 'pas1234' })

        const response = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', email: 'mimo@mimo.com', password: 'pas1234' })

        expect(response.status).toBe(400)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toEqual("username or email not available")

        done()
    });

    it('Create multiple new user', async(done) => {
        const response = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', email: 'mimo@mimo.com', password: 'pas1234' })

        const response2 = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo2', email: 'mimo2@mimo.com', password: 'pas1234' })

        const response3 = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo3', email: 'mimo3@mimo.com', password: 'pas1234' })

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
            .send({ userName: 'mimo', email: 'mimo@mimo.com', password: 'pas1234' })

        const response2 = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo2', email: 'mimo2_mimo.com', password: 'pas1234' })

        const response3 = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo3', email: 'mimo3@mimo.com', password: 'pas1234' })

        const response4 = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo3', email: 'mimo3@mimo.com', password: 'pas1234' })

        const response5 = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo5', email: 'mimo5@mimo.com', password: 'pas1234' })

        expect(response.error).toBe(false)
        expect(response.status).toBe(201)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('token')
        expect(response2.status).toBe(400)
        expect(response2.body).not.toBeNull()
        expect(response2.body).toHaveProperty('error')
        expect(response2.body.error).toEqual("username or email not available")
        expect(response3.error).toBe(false)
        expect(response3.status).toBe(201)
        expect(response3.body).not.toBeNull()
        expect(response3.body).toHaveProperty('token')
        expect(response4.status).toBe(400)
        expect(response4.body).not.toBeNull()
        expect(response4.body).toHaveProperty('error')
        expect(response4.body.error).toEqual("username or email not available")
        expect(response5.error).toBe(false)
        expect(response5.status).toBe(201)
        expect(response5.body).not.toBeNull()
        expect(response5.body).toHaveProperty('token')

        done()
    });
});

describe('login route test', () => {
    it('send email and password', async(done) => {
        const aux = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', email: 'mimo@mimo.com', password: 'pas1234' })

        const response = await request(app)
            .post(`${apiVersion}/users/login`)
            .send({ email: 'mimo@mimo.com', password: 'pas1234' })

        expect(response.error).toBe(false)
        expect(response.status).toBe(200)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('token')

        done()
    });

    it('send bad email and password', async(done) => {
        const aux = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', email: 'mimo@mimo.com', password: 'pas1234' })

        const response = await request(app)
            .post(`${apiVersion}/users/login`)
            .send({ email: 'mimo2@mimo.com', password: 'pas11234' })

        expect(response.status).toBe(400)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('error')

        done()
    });

    it('send bad credentials after good credentials', async(done) => {
        const aux = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', email: 'mimo@mimo.com', password: 'pas1234' })

        const response = await request(app)
            .post(`${apiVersion}/users/login`)
            .send({ email: 'mimo2@mimo.com', password: 'pas11234' })

        const response2 = await request(app)
            .post(`${apiVersion}/users/login`)
            .send({ email: 'mimo@mimo.com', password: 'pas1234' })

        expect(response.status).toBe(400)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('error')
        expect(response2.error).toBe(false)
        expect(response2.status).toBe(200)
        expect(response2.body).not.toBeNull()
        expect(response2.body).toHaveProperty('token')
        expect(response2.body.token).toEqual(aux.body.token)

        done()
    });




});