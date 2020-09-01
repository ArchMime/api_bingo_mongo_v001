require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { newDemandTickets, acceptDemand, rejectDemand, demandOfMyMatches } = require('../src/controller/demandTicketController')
const jwt = require('jsonwebtoken')
const { secret } = require('../src/envConfig')
const { createUser } = require('../src/controller/userController')
const { createMatch } = require('../src/controller/matchController')

describe('request ticket', () => {
    it('request a ticket', async(done) => {
        let user = await createUser('mimo', 'pas1234')
        let player = await createUser('player', 'pas123')
        let match = await createMatch('', '', user.token)

        let newRequest = await newDemandTickets(player.token, match._id, 'ticket', '2', 'messagetest')

        expect(newRequest).not.toBeNull()
        expect(newRequest).not.toHaveProperty('error')
        expect(newRequest).toHaveProperty('_id')
        expect(newRequest).toHaveProperty('player')
        expect(newRequest).toHaveProperty('match')

        done()
    });

    it('accept request tickets', async(done) => {

        let user = await createUser('mimo', 'pas1234')
        let player = await createUser('player', 'pas123')
        let match = await createMatch('', '', user.token)
        let decode = await jwt.verify(player.token, secret)

        let newRequest = await newDemandTickets(player.token, match._id, 'ticket', '2', 'messagetest')

        let newAccept = await acceptDemand(user.token, newRequest._id)

        expect(newAccept).not.toBeNull()
        expect(newAccept).toHaveLength(2)
        expect(newAccept[1]).toHaveProperty('_id')
        expect(newAccept[1]).toHaveProperty('player')
        expect(newAccept[1]).toHaveProperty('match')
        expect(newAccept[0]).toHaveProperty('_id')
        expect(newAccept[0]).toHaveProperty('player')
        expect(newAccept[0]).toHaveProperty('match')
        done()
    });

    it('accept request serie', async(done) => {

        let user = await createUser('mimo', 'pas1234')
        let player = await createUser('player', 'pas123')
        let match = await createMatch('', '', user.token)
        let newRequest = await newDemandTickets(player.token, match._id, 'serie', '1', 'messagetest')

        let newAccept = await acceptDemand(user.token, newRequest._id)

        expect(newAccept).not.toBeNull()
        expect(newAccept).toHaveLength(1)
        expect(newAccept[0]).toHaveLength(6)
        expect(newAccept[0][0]).toHaveProperty('_id')
        expect(newAccept[0][0]).toHaveProperty('player')
        expect(newAccept[0][0]).toHaveProperty('match')
        done()
    });

    it('reject demand', async(done) => {
        let user = await createUser('mimo', 'pas1234')
        let player = await createUser('player', 'pas123')
        let match = await createMatch('', '', user.token)
        let newRequest = await newDemandTickets(player.token, match._id, 'serie', '1', 'messagetest')

        let newReject = await rejectDemand(user.token, newRequest._id)

        expect(newReject).not.toBeNull()
        expect(newReject).toBe('removed')
        done()
    });


    it('get demand of my matches', async(done) => {
        let user = await createUser('mimo', 'pas1234')
        let player = await createUser('player', 'pas123')
        let player2 = await createUser('player2', 'pas123')
        let match = await createMatch('', '', user.token)

        await newDemandTickets(player.token, match._id, 'serie', '1', 'messagetest')
        await newDemandTickets(player2.token, match._id, 'ticket', '3', 'messagetest')

        let myDemands = await demandOfMyMatches(user.token)

        expect(myDemands).not.toBeNull()
        expect(myDemands).toHaveLength(1)
        expect(myDemands[0]).toHaveLength(2)
        expect(myDemands[0][0]).toHaveProperty('_id')
        expect(myDemands[0][0]).toHaveProperty('player')
        expect(myDemands[0][0]).toHaveProperty('match')
        expect(myDemands[0][1]).toHaveProperty('_id')
        expect(myDemands[0][1]).toHaveProperty('player')
        expect(myDemands[0][1]).toHaveProperty('match')
        done()
    });

    it('get demand of my matches 2', async(done) => {
        let user = await createUser('mimo', 'pas1234')
        let player = await createUser('player', 'pas123')
        let player2 = await createUser('player2', 'pas123')
        let match = await createMatch('', '', user.token)
        let match2 = await createMatch('', '', user.token)

        await newDemandTickets(player.token, match._id, 'serie', '1', 'messagetest')
        await newDemandTickets(player2.token, match._id, 'ticket', '3', 'messagetest')

        await newDemandTickets(player.token, match2._id, 'serie', '1', 'messagetest')
        await newDemandTickets(player2.token, match2._id, 'ticket', '3', 'messagetest')

        let myDemands = await demandOfMyMatches(user.token)

        expect(myDemands).not.toBeNull()
        expect(myDemands).toHaveLength(2)
        expect(myDemands[0]).toHaveLength(2)
        expect(myDemands[0][0]).toHaveProperty('_id')
        expect(myDemands[0][0]).toHaveProperty('player')
        expect(myDemands[0][0]).toHaveProperty('match')
        expect(myDemands[0][1]).toHaveProperty('_id')
        expect(myDemands[0][1]).toHaveProperty('player')
        expect(myDemands[0][1]).toHaveProperty('match')
        expect(myDemands[1]).toHaveLength(2)
        expect(myDemands[1][0]).toHaveProperty('_id')
        expect(myDemands[1][0]).toHaveProperty('player')
        expect(myDemands[1][0]).toHaveProperty('match')
        expect(myDemands[1][1]).toHaveProperty('_id')
        expect(myDemands[1][1]).toHaveProperty('player')
        expect(myDemands[1][1]).toHaveProperty('match')
        done()
    });
});