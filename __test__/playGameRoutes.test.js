require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { createTicket, createSerie } = require('../src/controller/ticketController')
const { createUser } = require('../src/controller/userController')
const { createMatch } = require('../src/controller/matchController')
const runPlayGame = require('../src/controller/playGameController')
const playGameRoutes = require('../src/routes/playGameRoutes')
const { secret } = require('../src/envConfig')
const jwt = require('jsonwebtoken')
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

describe('play game', () => {
    it('play game', async(done) => {

        let user = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        let player = await createUser('player', 'player@email.com', 'pas123')
        let player2 = await createUser('player2', 'player2@email.com', 'pas123')
        let player3 = await createUser('player3', 'player3@email.com', 'pas123')
        let match = await createMatch('', '', user.token)
        let decode = await jwt.verify(player.token, secret)
        let decode2 = await jwt.verify(player2.token, secret)
        let decode3 = await jwt.verify(player3.token, secret)
        for (let i = 0; i < 15; i++) {
            await createTicket(user.token, match.match._id, decode.id)
            await createSerie(user.token, match.match._id, decode.id)
        }

        for (let i = 0; i < 15; i++) {
            await createTicket(user.token, match.match._id, decode2.id)
            await createSerie(user.token, match.match._id, decode2.id)
        }
        for (let i = 0; i < 15; i++) {
            await createTicket(user.token, match.match._id, decode3.id)
            await createSerie(user.token, match.match._id, decode3.id)
        }

        const response = await request(app)
            .post(`${apiVersion}/matches/playgame`)
            .send({ match: match.match._id })
            .set('token', user.token)

        expect(response.status).toBe(201)
        expect(response.body).not.toBeNull()
        expect(response.body).toHaveProperty('game')
        expect(response.body.game).not.toHaveProperty('error')

        done()
    });

});