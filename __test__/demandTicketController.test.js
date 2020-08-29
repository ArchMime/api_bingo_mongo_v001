require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { requestTickets, acceptRequest, rejectDemand, requestOfMyMatches } = require('../src/controller/demandTicketController')
const jwt = require('jsonwebtoken')
const { secret } = require('../src/envConfig')
const { createUser } = require('../src/controller/userController')
const { createMatch } = require('../src/controller/matchController')

describe('request ticket', () => {
    it('request a ticket', async(done) => {
        let user = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        let player = await createUser('player', 'player@email.com', 'pas123')
        let match = await createMatch('', '', user.token)

        let newRequest = await requestTickets(player.token, match.match._id, 'ticket', '2', 'messagetest')

        expect(newRequest).not.toBeNull()
        expect(newRequest).not.toHaveProperty('error')
        expect(newRequest).not.toHaveProperty('message')
        expect(newRequest).toHaveProperty('ticketRequest')
        done()
    });

    it('accept request tickets', async(done) => {

        let user = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        let player = await createUser('player', 'player@email.com', 'pas123')
        let match = await createMatch('', '', user.token)
        let decode = await jwt.verify(player.token, secret)

        let newRequest = await requestTickets(player.token, match.match._id, 'ticket', '2', 'messagetest')

        let newAccept = await acceptRequest(user.token, newRequest.ticketRequest._id, decode.id)

        expect(newAccept).not.toBeNull()
        expect(newAccept).toHaveProperty('acceptTickets')
        expect(newAccept.acceptTickets).toHaveLength(2)
        done()
    });
    it('accept request serie', async(done) => {

        let user = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        let player = await createUser('player', 'player@email.com', 'pas123')
        let match = await createMatch('', '', user.token)
        let decode = await jwt.verify(player.token, secret)
        let newRequest = await requestTickets(player.token, match.match._id, 'serie', '1', 'messagetest')

        let newAccept = await acceptRequest(user.token, newRequest.ticketRequest._id, decode.id)

        expect(newAccept).not.toBeNull()
        expect(newAccept).toHaveProperty('acceptTickets')
        expect(newAccept.acceptTickets).toHaveLength(1)
        expect(newAccept.acceptTickets[0]).toHaveLength(6)
        done()
    });

    it('reject demand', async(done) => {
        let user = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        let player = await createUser('player', 'player@email.com', 'pas123')
        let match = await createMatch('', '', user.token)
        let newRequest = await requestTickets(player.token, match.match._id, 'serie', '1', 'messagetest')

        let newReject = await rejectDemand(user.token, newRequest.ticketRequest._id)

        expect(newReject).not.toBeNull()
        expect(newReject).toHaveProperty('message', 'removed')
        expect(newReject).not.toHaveProperty('error')
        done()
    });


    it('get demand of my matches', async(done) => {
        let user = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        let player = await createUser('player', 'player@email.com', 'pas123')
        let player2 = await createUser('player2', 'playe2r@email.com', 'pas123')
        let match = await createMatch('', '', user.token)

        await requestTickets(player.token, match.match._id, 'serie', '1', 'messagetest')
        await requestTickets(player2.token, match.match._id, 'ticket', '3', 'messagetest')

        let myDemands = await requestOfMyMatches(user.token)

        expect(myDemands).not.toBeNull()
        expect(myDemands).toHaveProperty('demands')
        done()
    });

});