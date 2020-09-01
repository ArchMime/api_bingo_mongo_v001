require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { createTicket, createSerie } = require('../src/controller/ticketController')
const { createUser } = require('../src/controller/userController')
const { createMatch } = require('../src/controller/matchController')
const { runPlayGame, myVictory } = require('../src/controller/playGameController')
const { secret } = require('../src/envConfig')
const jwt = require('jsonwebtoken')

describe('play game controller', () => {
    it('play game', async(done) => {

        let user = await createUser('mimo', 'pas1234')
        let player = await createUser('player', 'pas123')
        let player2 = await createUser('player2', 'pas123')
        let player3 = await createUser('player3', 'pas123')
        let match = await createMatch('', '', user.token)
        let decode = await jwt.verify(player.token, secret)
        let decode2 = await jwt.verify(player2.token, secret)
        let decode3 = await jwt.verify(player3.token, secret)
        for (let i = 0; i < 15; i++) {
            await createTicket(user.token, match._id, decode.id)
            await createSerie(user.token, match._id, decode.id)
        }

        for (let i = 0; i < 15; i++) {
            await createTicket(user.token, match._id, decode2.id)
            await createSerie(user.token, match._id, decode2.id)
        }
        for (let i = 0; i < 15; i++) {
            await createTicket(user.token, match._id, decode3.id)
            await createSerie(user.token, match._id, decode3.id)
        }

        let playedGame = await runPlayGame(user.token, match._id)

        expect(playedGame).not.toBeNull()
        expect(playedGame).not.toHaveProperty('error')
        expect(playedGame).not.toHaveProperty('message')
        expect(playedGame).toHaveProperty('numbersPlayed')
        expect(playedGame).toHaveProperty('winningTickets')
        expect(playedGame.winningTickets[0].lines[0]).toBe('xxxxx')
        expect(playedGame.winningTickets[0].lines[1]).toBe('xxxxx')
        expect(playedGame.winningTickets[0].lines[2]).toBe('xxxxx')
        done()
    }, 10000);

});

describe('my victories', () => {
    it('test function', async(done) => {

        let user = await createUser('mimo', 'pas1234')
        let player = await createUser('player', 'pas123')
        let match = await createMatch('', '', user.token)
        let match2 = await createMatch('', '', user.token)
        let decode = await jwt.verify(player.token, secret)

        for (let i = 0; i < 3; i++) {
            await createTicket(user.token, match2._id, decode.id)
            await createSerie(user.token, match._id, decode.id)
        }

        await runPlayGame(user.token, match._id)

        await runPlayGame(user.token, match2._id)

        const mwMatch = await myVictory(player.token)

        expect(mwMatch).toHaveProperty('linesWin')
        expect(mwMatch).toHaveProperty('matchesWin')
        done()
    });

});