require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { apiVersion } = require('../src/envConfig')
const { createUser } = require('../src/controller/userController')

const request = require('supertest')
const app = require('../src/app')

let testServer
beforeAll(async() => {
    testServer = await app.listen(4000)
})

afterAll((done) => {
    testServer.close(done)
})

describe('new match route test', () => {
    it('create new match', async(done) => {
        const auxUser = await createUser('mimo', 'pas1234')
        const response = await request(app)
            .post(`${apiVersion}/matches/newmatch`)
            .send({ date: Date.now(), description: 'primer match' })
            .set('token', auxUser.token)

        expect(response.status).toBe(201)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('_id')
        expect(response.error).toBe(false)
        done()
    });

    it('create new match without date and without description', async(done) => {
        const auxUser = await createUser('mimo', 'pas1234')

        const response = await request(app)
            .post(`${apiVersion}/matches/newmatch`)
            .send({ date: '', description: '' })
            .set('token', auxUser.token)

        expect(response.status).toBe(201)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('_id')
        expect(response.error).toBe(false)
        done()
    });

});

describe('get match route test', () => {
    it('get match', async(done) => {
        const auxUser = await createUser('mimo', 'pas1234')

        const match = await request(app)
            .post(`${apiVersion}/matches/newmatch`)
            .send({ date: Date.now(), description: 'primer match' })
            .set('token', auxUser.token)

        const response = await request(app)
            .get(`${apiVersion}/matches/getmatch`)
            .send({ matchId: match.body._id })
            .set('token', auxUser.token)


        expect(response.status).toBe(200)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('match')
        expect(response.error).toBe(false)
        expect(response.body.match._id).toEqual(match.body._id)
        done()
    });
});