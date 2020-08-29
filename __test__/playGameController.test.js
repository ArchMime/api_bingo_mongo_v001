require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { createTicket, createSerie } = require('../src/controller/ticketController')
const { createUser } = require('../src/controller/userController')
const { createMatch } = require('../src/controller/matchController')
const runPlayGame = require('../src/controller/playGameController')
const { PlayGameModel } = require('../src/models/playGameModel')
const { secret } = require('../src/envConfig')
const jwt = require('jsonwebtoken')

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

        let playedGame = await runPlayGame(user.token, match.match._id)

        expect(playedGame).not.toBeNull()
        expect(playedGame).not.toHaveProperty('error')
        expect(playedGame).not.toHaveProperty('message')
        expect(playedGame).toHaveProperty('numbersPlayed')
        expect(playedGame).toHaveProperty('winningTickets')
        expect(playedGame.winningTickets[0].lines[0]).toBe('xxxxx')
        expect(playedGame.winningTickets[0].lines[1]).toBe('xxxxx')
        expect(playedGame.winningTickets[0].lines[2]).toBe('xxxxx')
        done()
    });

});