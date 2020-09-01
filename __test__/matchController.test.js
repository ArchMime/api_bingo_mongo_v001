require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { createMatch, getMatch, myMatches, getAllMatches, matchesThatIPlay } = require('../src/controller/matchController')
const { secret } = require('../src/envConfig')
const jwt = require('jsonwebtoken')

const { createUser } = require('../src/controller/userController')
const { createTicket } = require('../src/controller/ticketController')
const { UserModel } = require('../src/models/userModel')

let auxToken, decode, auxUser

describe('test for create match function', () => {
    it('create new match', async(done) => {
        auxToken = await createUser('mimo', 'pas1234')
        decode = await jwt.verify(auxToken.token, secret)
        auxUser = await UserModel.findById(decode.id, { password: 0 })
        let dt = new Date()
        let descrption = ''
        let response = await createMatch(dt, descrption, auxToken.token)

        expect(response).not.toBeNull()
        expect(response).toHaveProperty('master')
        expect(response.master).toEqual(String(auxUser._id))
        done()
    });

    it('create new match invalid token', async(done) => {
        auxToken = await createUser('mimo', 'pas1234')
        decode = await jwt.verify(auxToken.token, secret)
        auxUser = await UserModel.findById(decode.id)
        let dt = new Date()
        let matchData = { date: dt, descrption: 'veamos si funca' }
        let response = await createMatch(matchData, 'cuaquiertoken')

        expect(response).not.toBeNull()
        expect(response).toMatchObject({ message: "jwt must be provided" })
        done()
    });

    it('create new match no date', async(done) => {
        auxToken = await createUser('mimo', 'pas1234')
        decode = await jwt.verify(auxToken.token, secret)
        auxUser = await UserModel.findById(decode.id)
        let date = ''
        let descrption = ''
        let response = await createMatch(date, descrption, auxToken.token)

        expect(response).not.toBeNull()
        expect(response).toHaveProperty('master')
        expect(response.master).toEqual(String(auxUser._id))
        done()
    });
});

describe('test for get match function', () => {
    it('get match', async(done) => {
        auxToken = await createUser('mimo', 'pas1234')
        decode = await jwt.verify(auxToken.token, secret)
        let dt = new Date()
        let descrption = 'ramdon menssage'
        let auxResponse = await createMatch(dt, descrption, auxToken.token)
        let response = await getMatch(auxResponse._id, auxToken.token)

        expect(response).not.toBeNull()
        expect(response.match).toHaveProperty('_id')
        expect(response.match).toHaveProperty('master')
        expect(response).toHaveProperty('isMaster')
        expect(response.isMaster).toEqual(true)
        expect(response).toHaveProperty('allTicketsOfThisMatch')
        expect(response).toHaveProperty('myTicketsOfThisMatch')
        done()
    });

    it('get match bad data', async(done) => {
        auxToken = await createUser('mimo', 'pas1234')
        decode = await jwt.verify(auxToken.token, secret)
        auxUser = await UserModel.findById(decode.id, { password: 0 })
        let dt = new Date()
        let descrption = 'Ramdon message'
        await createMatch(dt, descrption, auxToken.token)
        let response = await getMatch('auxResponse', auxToken.token)

        expect(response).not.toBeNull()
        expect(response).not.toHaveProperty('master')
        expect(response).toMatchObject({ message: "invalid match identifier" })


        done()
    });
});

describe('test for my matches function', () => {
    it('get my matches', async(done) => {
        auxToken = await createUser('mimo', 'pas1234')
        let dt = new Date()
        let descrption = 'veamos si funca'
        await createMatch(dt, descrption, auxToken.token)
        await createMatch(dt, descrption, auxToken.token)
        await createMatch(dt, descrption, auxToken.token)
        let response = await myMatches(auxToken.token)

        expect(response).not.toBeNull()
        expect(response).toHaveProperty('isMaster')
        expect(response).toHaveProperty('matches')
        expect(response.matches).toHaveLength(3)
        done()
    });

    it('get zero matches', async(done) => {
        auxToken = await createUser('mimo', 'pas1234')

        let response = await myMatches(auxToken.token)

        expect(response).not.toBeNull()
        expect(response).toHaveProperty('matches')
        expect(response.matches).toHaveLength(0)
        done()
    });
    it('send bad token', async(done) => {
        auxToken = await createUser('mimo', 'pas1234')
        let response = await myMatches('auxToken')

        expect(response).not.toHaveProperty('token')
        expect(response).not.toHaveProperty('matches')
        expect(response).toMatchObject({ message: "jwt malformed" })

        done()
    });
});

describe('test for get all matches', () => {
    it('getAllMatches', async(done) => {
        auxToken = await createUser('mimo', 'pas1234')
        auxToken2 = await createUser('mimo2', 'pas1234')
        auxToken3 = await createUser('mimo3', 'pas1234')
        let dt = new Date()
        let descrption = 'random text'
        for (let i = 0; i < 2; i++) {
            await createMatch(dt, descrption, auxToken.token)
            await createMatch(dt, descrption, auxToken2.token)
            await createMatch(dt, descrption, auxToken3.token)
        }
        let response = await getAllMatches(auxToken.token)

        expect(response).not.toBeNull()
        expect(response).toHaveLength(6)
        done()
    });

    it('getAllMatches whit zero matches', async(done) => {
        auxToken = await createUser('mimo', 'pas1234')
        let response = await getAllMatches(auxToken.token)

        expect(response).not.toBeNull()
        expect(response).toHaveLength(0)
        done()
    });
});

describe('get matchesThatIPlay', () => {
    it('matchesThatIPlay', async(done) => {
        auxToken = await createUser('mimo', 'pas1234')
        auxToken2 = await createUser('mimo2', 'pas1234')
        auxToken3 = await createUser('mimo3', 'pas1234')
        decode = await jwt.verify(auxToken3.token, secret)
        let dt = new Date()
        let descrption = 'random text'
        let match = await createMatch(dt, descrption, auxToken.token)
        let match2 = await createMatch(dt, descrption, auxToken2.token)

        await createTicket(auxToken.token, match._id, decode.id)
        await createTicket(auxToken2.token, match2._id, decode.id)
        await createTicket(auxToken2.token, match2._id, decode.id)

        let response = await matchesThatIPlay(auxToken3.token)

        expect(response).not.toBeNull()
        expect(response).toHaveLength(2)
        done()
    });
});