require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { apiVersion } = require('../src/envConfig')
const request = require('supertest')
const app = require('../src/app')
const { createUser } = require('../src/controller/userController')
const { createMatch } = require('../src/controller/matchController')

let testServer
beforeAll(async() => {
    testServer = await app.listen(4000)
})

afterAll((done) => {
    testServer.close(done)
})

describe('create new request', () => {
    it('post the request', async(done) => {
        let user = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        let player = await createUser('player', 'player@email.com', 'pas123')
        let match = await createMatch('', '', user.token)
        const response = await request(app)
            .post(`${apiVersion}/demandTicket/newdemand`)
            .send({ match: match.match._id, type: 'ticket', quantity: '2', message: 'first demand' })
            .set('token', player.token)

        expect(response.status).toBe(201)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('message')

        done()
    });

});

describe('accept request route', () => {
    it('post accept request', async(done) => {
        let user = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        let player = await createUser('player', 'player@email.com', 'pas123')
        let match = await createMatch('', '', user.token)
        let demand = await request(app)
            .post(`${apiVersion}/demandTicket/newdemand`)
            .send({ match: match.match._id, type: 'ticket', quantity: '2', message: 'first demand' })
            .set('token', player.token)

        let aux = demand.body.demand
        let response = await request(app)
            .post(`${apiVersion}/demandTicket/aceptdemand`)
            .send({ requestId: aux._id, playerId: aux.player })
            .set('token', user.token)

        expect(response.status).toBe(201)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('message')

        done()
    });

});

describe('reject request route', () => {
    it('reject request', async(done) => {
        let user = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        let player = await createUser('player', 'player@email.com', 'pas123')
        let match = await createMatch('', '', user.token)
        let demand = await request(app)
            .post(`${apiVersion}/demandTicket/newdemand`)
            .send({ match: match.match._id, type: 'ticket', quantity: '2', message: 'first demand' })
            .set('token', player.token)

        let aux = demand.body.demand
        let response = await request(app)
            .post(`${apiVersion}/demandTicket/rejectdemand`)
            .send({ requestId: aux._id })
            .set('token', user.token)

        expect(response.status).toBe(201)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('message')
        done()
    });

});