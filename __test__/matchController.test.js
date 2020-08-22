require('dotenv').config()

const { models, make, mer, check } = require('./bundle')
const { createMatch, getMatch, myMatches } = require('../src/controller/matchController')
const { secret } = require('../src/envConfig')
const jwt = require('jsonwebtoken')

const { createUser } = require('../src/controller/userController')
const { UserModel } = require('../src/models/userModel')

let auxToken, decode, auxUser

describe('test for create match function', () => {
    it('create new match', async(done) => {
        auxToken = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        decode = await jwt.verify(auxToken.token, secret)
        auxUser = await UserModel.findById(decode.id, { password: 0 })
        let dt = new Date()
        let descrption = 'veamos si funca'
        let response = await createMatch(dt, descrption, auxToken.token)

        expect(response).not.toBeNull()
        expect(response).toHaveProperty('token')
        expect(response.token).toEqual(auxToken.token)
        expect(response).toHaveProperty('match')
        expect(response.match).toHaveProperty('master')
        expect(response.match.master).toEqual(String(auxUser._id))
        done()
    });

    it('create new match invalid token', async(done) => {
        auxToken = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        decode = await jwt.verify(auxToken.token, secret)
        auxUser = await UserModel.findById(decode.id)
        let dt = new Date()
        let matchData = { date: dt, descrption: 'veamos si funca' }
        let response = await createMatch(matchData, 'cuaquiertoken')

        expect(response).not.toBeNull()
        expect(response).toHaveProperty('error')
        done()
    });

    it('create new match no date', async(done) => {
        auxToken = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        decode = await jwt.verify(auxToken.token, secret)
        auxUser = await UserModel.findById(decode.id, { password: 0 })
        let date = ''
        let descrption = 'veamos si funca'
        let response = await createMatch(date, descrption, auxToken.token)

        expect(response).not.toBeNull()
        expect(response).toHaveProperty('token')
        expect(response.token).toEqual(auxToken.token)
        expect(response).toHaveProperty('match')
        expect(response.match).toHaveProperty('master')
        expect(response.match.master).toEqual(String(auxUser._id))
        done()
    });
});

describe('test for get match function', () => {
    it('get match', async(done) => {
        auxToken = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        decode = await jwt.verify(auxToken.token, secret)
        auxUser = await UserModel.findById(decode.id, { password: 0 })
        let dt = new Date()
        let descrption = 'veamos si funca'
        let auxResponse = await createMatch(dt, descrption, auxToken.token)
        let response = await getMatch(auxResponse.match._id, auxToken.token)

        expect(response).not.toBeNull()
        expect(response).toHaveProperty('token')
        expect(response.token).toEqual(auxToken.token)
        expect(response.match).toHaveProperty('master')
        expect(response.match.master).toEqual(String(auxUser._id))
        done()
    });

    it('get match bad data', async(done) => {
        auxToken = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        decode = await jwt.verify(auxToken.token, secret)
        auxUser = await UserModel.findById(decode.id, { password: 0 })
        let dt = new Date()
        let descrption = 'veamos si funca'
        let auxResponse = await createMatch(dt, descrption, auxToken.token)
        let response = await getMatch('auxResponse', auxToken.token)

        expect(response).not.toBeNull()
        expect(response).not.toHaveProperty('token')
        expect(response).not.toHaveProperty('match')
        expect(response).toHaveProperty('error')
        expect(response).toHaveProperty('message')
        expect(response.message).toEqual('Invalid data')

        done()
    });
});

describe('test for my matches function', () => {
    it('get my matches', async(done) => {
        auxToken = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        decode = await jwt.verify(auxToken.token, secret)
        auxUser = await UserModel.findById(decode.id, { password: 0 })
        let dt = new Date()
        let descrption = 'veamos si funca'
        let auxResponse = await createMatch(dt, descrption, auxToken.token)
        let auxResponse2 = await createMatch(dt, descrption, auxToken.token)
        let auxResponse3 = await createMatch(dt, descrption, auxToken.token)
        let response = await myMatches(auxToken.token)

        expect(response).not.toBeNull()
        expect(response).toHaveProperty('token')
        expect(response.token).toEqual(auxToken.token)
        expect(response).toHaveProperty('matches')
        expect(response.matches).toHaveLength(3)
        done()
    });

    it('get zero matches', async(done) => {
        auxToken = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        decode = await jwt.verify(auxToken.token, secret)
        auxUser = await UserModel.findById(decode.id, { password: 0 })

        let response = await myMatches(auxToken.token)

        expect(response).not.toBeNull()
        expect(response).toHaveProperty('token')
        expect(response.token).toEqual(auxToken.token)
        expect(response).toHaveProperty('matches')
        expect(response.matches).toHaveLength(0)
        done()
    });
    it('send bad token', async(done) => {
        auxToken = await createUser('mimo', 'mimo@mimo.com', 'pas1234')
        decode = await jwt.verify(auxToken.token, secret)
        auxUser = await UserModel.findById(decode.id, { password: 0 })
        let response = await myMatches('auxToken')

        expect(response).not.toHaveProperty('token')
        expect(response).not.toHaveProperty('matches')
        expect(response).toHaveProperty('error')
        expect(response).toHaveProperty('message')
        expect(response.message).toEqual('Invalid data')

        done()
    });
});