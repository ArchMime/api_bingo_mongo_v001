require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { apiVersion, secret } = require('../src/envConfig')
const jwt = require('jsonwebtoken')
const request = require('supertest')
const { createUser } = require('../src/controller/userController')
const { createMatch } = require('../src/controller/matchController')
const { newDemandTickets } = require('../src/controller/demandTicketController')
const { createTicket, createSerie } = require('../src/controller/ticketController')


const app = require('../src/app')

let testServer
beforeAll(async() => {
    testServer = await app.listen(4000)
})

afterAll((done) => {
    testServer.close(done)
})

describe('home route', () => {
    it('get home route', async(done) => {

        let user = await createUser('mimo', 'pas1234')
        let match = await createMatch('', '', user.token)
        let player = await createUser('player', 'pas123')
        await newDemandTickets(player.token, match._id, 'ticket', '2', 'messagetest')
        let decode = await jwt.verify(player.token, secret)
        await createTicket(user.token, match._id, decode.id)
        await createSerie(user.token, match._id, decode.id)

        const response = await request(app)
            .get(`${apiVersion}/home`)
            .set('token', user.token)

        expect(response.status).toBe(200)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('allMatches')
        expect(response.body).toHaveProperty('allTickets')
        expect(response.body).toHaveProperty('myDemands')
        expect(response.body).toHaveProperty('gamesThatIPlay')
        expect(response.body).not.toHaveProperty('error')
        done()

    });

});