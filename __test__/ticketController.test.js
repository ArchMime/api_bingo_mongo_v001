require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { createTicket, createSerie, getAllTicketOfMatch, getAllMyTickets, myTicketsOfMatch } = require('../src/controller/ticketController')
const { secret } = require('../src/envConfig')
const jwt = require('jsonwebtoken')

const { createUser } = require('../src/controller/userController')
const { createMatch } = require('../src/controller/matchController')
const { TicketModel } = require('../src/models/ticketModel')

describe('test for function select numbers of tickets', () => {
    it('test numbers of ticket', async(done) => {
        const auxTicket = new TicketModel({ match: 'asada', player: '1' })
        let numbers = await auxTicket.createNumbers()
        let arrayUnif = []
        for (i = 0; i < 3; i++) {
            arrayUnif = arrayUnif.concat(numbers[i])
        }
        //this callback should remove any duplicate elements inside #arrayunif, 
        //no duplicates are expected and #uniqs has all 15 numbers.
        let uniqs = arrayUnif.filter(function(item, index, array) {
            return array.indexOf(item) === index;
        })

        expect(numbers).not.toBeNull()
        expect(numbers).toHaveLength(3)
        expect(numbers[0]).toHaveLength(5)
        expect(numbers[1]).toHaveLength(5)
        expect(numbers[2]).toHaveLength(5)
        expect(uniqs).toHaveLength(15)
        done()
    });
    it('test numbers of serie', async(done) => {
        const auxTicket = new TicketModel({ match: 'asada', player: '1' })
        let numbers = await auxTicket.createNumbersOfSerie()

        let arrayUnif = []

        for (a = 0; a < 6; a++) {
            for (i = 0; i < 3; i++) {
                arrayUnif = arrayUnif.concat(numbers[a][i])
            }
        }
        //same as above but with 90 numbers.
        let uniqs = arrayUnif.filter(function(item, index, array) {
            return array.indexOf(item) === index;
        })

        uniqs.sort()

        expect(numbers).not.toBeNull()
        expect(numbers).toHaveLength(6)
        expect(numbers[0]).toHaveLength(3)
        expect(numbers[1]).toHaveLength(3)
        expect(numbers[2]).toHaveLength(3)
        expect(numbers[0][0]).toHaveLength(5)
        expect(numbers[0][1]).toHaveLength(5)
        expect(numbers[0][2]).toHaveLength(5)
        expect(uniqs).toHaveLength(90)
        done()
    });

});

describe('test for create tickect function', () => {
    it('create new ticket', async(done) => {
        let user = await createUser('mimo', 'pas1234')
        let player = await createUser('player', 'pas123')
        let match = await createMatch('', '', user.token)
        let decode = await jwt.verify(player.token, secret)
        let newTicket = await createTicket(user.token, match._id, decode.id)
        expect(newTicket).not.toBeNull()
        expect(newTicket).toHaveProperty('_id')
        done()
    });

    it('try create ticket without player', async(done) => {
        let user = await createUser('mimo', 'pas1234')
        let match = await createMatch('', '', user.token)
        let newTicket = await createTicket(user.token, match._id, '')
        expect(newTicket).not.toBeNull()
        expect(newTicket).toHaveProperty('message')
        done()
    });

    it('try create ticket without match', async(done) => {
        let user = await createUser('mimo', 'pas1234')
        let match = await createMatch('', '', user.token)
        let newTicket = await createTicket(user.token, '', '')
        expect(newTicket).not.toBeNull()
        expect(newTicket).toHaveProperty('message')
        done()
    });
});

describe('test for create serie function', () => {
    it('create new serie', async(done) => {
        let user = await createUser('mimo', 'pas1234')
        let player = await createUser('player', 'pas123')
        let match = await createMatch('', '', user.token)
        let decode = await jwt.verify(player.token, secret)
        let newSerie = await createSerie(user.token, match._id, decode.id)


        expect(newSerie).not.toBeNull()
        expect(newSerie).toHaveLength(6)
        done()
    });

});

describe('test for get ticket of match', () => {
    it('get all tickets of match', async(done) => {
        let user = await createUser('mimo', 'pas1234')
        let player = await createUser('player', 'pas123')
        let match = await createMatch('', '', user.token)
        let decode = await jwt.verify(player.token, secret)
        let newTicket = []
        for (let i = 0; i < 4; i++) {
            newTicket[i] = await createTicket(user.token, match._id, decode.id)
        }
        let newSerie = await createSerie(user.token, match._id, decode.id)

        let ticketOfMatch = await getAllTicketOfMatch(user.token, match._id)

        expect(ticketOfMatch).not.toBeNull()
        expect(ticketOfMatch).toHaveLength(10)
        done()
    });

});

describe('test for get all my tickets', () => {
    it('try to get all my tickets', async(done) => {
        let user = await createUser('mimo', 'pas1234')
        let player = await createUser('player', 'pas123')
        let decode = await jwt.verify(player.token, secret)
        let match = await createMatch('', '', user.token)
        let newTicket = []
        for (let i = 0; i < 4; i++) {
            newTicket[i] = await createTicket(user.token, match._id, decode.id)
        }
        let newSerie = await createSerie(user.token, match._id, decode.id)

        let matchTwo = await createMatch('', '', user.token)
        let newSerieTwo = await createSerie(user.token, matchTwo._id, decode.id)
        let allTickets = await getAllMyTickets(player.token)

        expect(allTickets).not.toBeNull()
        expect(allTickets).toHaveLength(16)
        done()
    });

});

describe('test for my tickets of match', () => {
    it('test function', async(done) => {
        let user = await createUser('mimo', 'pas1234')
        let player = await createUser('player', 'pas123')
        let match = await createMatch('', '', user.token)
        let decode = await jwt.verify(player.token, secret)

        let newTicket = []
        for (let i = 0; i < 4; i++) {
            newTicket[i] = await createTicket(user.token, match._id, decode.id)
        }
        let newSerie = await createSerie(user.token, match._id, decode.id)

        let matchTwo = await createMatch('', '', user.token)
        let newSerieTwo = await createSerie(user.token, matchTwo._id, decode.id)
        let allTickets = await myTicketsOfMatch(player.token, match._id)

        expect(allTickets).not.toBeNull()
        expect(allTickets).toHaveLength(10)
        done()
        done()
    });

});