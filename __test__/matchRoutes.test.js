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

describe('new match route test', () => {
    it('create new match', async(done) => {
        const user = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', email: 'mimo@mimo.com', password: 'pas1234' })
        const response = await request(app)
            .post(`${apiVersion}/matches/newmatch`)
            .send({ date: Date.now(), description: 'primer match' })
            .set('token', user.body.token)

        expect(response.status).toBe(201)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('token')
        expect(response.body).toHaveProperty('match')
        expect(response.body.token).toEqual(user.body.token)
        expect(response.error).toBe(false)
        done()
    });

    it('create new match without date and without description', async(done) => {
        const user = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', email: 'mimo@mimo.com', password: 'pas1234' })
        const response = await request(app)
            .post(`${apiVersion}/matches/newmatch`)
            .send({ date: '', description: '' })
            .set('token', user.body.token)

        expect(response.status).toBe(201)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('token')
        expect(response.body).toHaveProperty('match')
        expect(response.body.token).toEqual(user.body.token)
        expect(response.error).toBe(false)
        done()
    });

});

describe('get match route test', () => {
    it('get match', async(done) => {
        const user = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', email: 'mimo@mimo.com', password: 'pas1234' })
        const match = await request(app)
            .post(`${apiVersion}/matches/newmatch`)
            .send({ date: Date.now(), description: 'primer match' })
            .set('token', user.body.token)

        const response = await request(app)
            .get(`${apiVersion}/matches/getmatch`)
            .send({ matchId: match.body.match._id })
            .set('token', user.body.token)


        expect(response.status).toBe(200)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('token')
        expect(response.body).toHaveProperty('match')
        expect(response.body.token).toEqual(user.body.token)
        expect(response.error).toBe(false)
        expect(response.body.match._id).toEqual(match.body.match._id)
        done()
    });
});


describe('get my matches route test', () => {
    it('my matches', async(done) => {
        const user = await request(app)
            .post(`${apiVersion}/users/singin`)
            .send({ userName: 'mimo', email: 'mimo@mimo.com', password: 'pas1234' })
        const match = await request(app)
            .post(`${apiVersion}/matches/newmatch`)
            .send({ date: Date.now(), description: 'primer match' })
            .set('token', user.body.token)

        const match2 = await request(app)
            .post(`${apiVersion}/matches/newmatch`)
            .send({ date: Date.now(), description: 'segundo match' })
            .set('token', user.body.token)

        const match3 = await request(app)
            .post(`${apiVersion}/matches/newmatch`)
            .send({ date: Date.now(), description: 'tercer match' })
            .set('token', user.body.token)

        const response = await request(app)
            .get(`${apiVersion}/matches/mymatches`)
            .set('token', user.body.token)


        expect(response.status).toBe(200)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('token')
        expect(response.body).toHaveProperty('matches')
        expect(response.body.token).toEqual(user.body.token)
        expect(response.error).toBe(false)
        expect(response.body.matches).toHaveLength(3)
        done()
    });
});