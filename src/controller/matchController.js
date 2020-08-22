const { MatchModel } = require('../models/matchModel')
const { UserModel } = require('../models/userModel')

const jwt = require('jsonwebtoken')
const { secret } = require('../envConfig')

async function createMatch(date, descrption, token) {

    try {

        let decode = await jwt.verify(token, secret)
        let user = await UserModel.findById(decode.id)

        if (user) {
            let match = new MatchModel({
                master: user._id,
                date: date,
                description: descrption
            })

            await match.save()

            return { match: match, token: token }
        } else {
            return { message: 'not found' }
        }

    } catch (e) {
        return { message: "Invalid data", error: e }
    }
}

async function getMatch(matchId, token) {

    try {
        let decode = await jwt.verify(token, secret)
        let user = await UserModel.findById(decode.id)
        let match = await MatchModel.findById(matchId)

        if (user && match) {
            return { match: match, token: token }
        } else {
            return { message: 'not found' }
        }
    } catch (e) {
        return { message: "Invalid data", error: e }
    }
}

async function myMatches(token) {
    try {
        let decode = await jwt.verify(token, secret)
        let user = await UserModel.findById(decode.id)
        let matches = await MatchModel.find({ master: String(user._id) })

        if (user && matches) {
            return { matches: matches, token: token }
        } else {
            return { message: 'not found' }
        }
    } catch (e) {
        return { message: "Invalid data", error: e }
    }
}

module.exports = { createMatch, getMatch, myMatches }