const { MatchModel } = require('../models/matchModel')
const { UserModel } = require('../models/userModel')

const jwt = require('jsonwebtoken')
const { secret } = require('../envConfig')

/**
 * createMatch function
 *
 * @param   {Date}  date        date the game was played
 * @param   {String}  descrption  Information relevant to the match
 * @param   {Token}  token       User validator
 *
 * @return  {Object}              the function returns an object composed of a token and a match
 */
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

/**
 * getMatch function
 *
 * @param   {id}  matchId  id of the match to play
 * @param   {token}  token    user validator
 *
 * @return  {Object}           the function returns an object composed of a token and a match
 */
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

/**
 * myMatches function
 *
 * @param   {token}  token  validator user
 *
 * @return  {object}         returns a user token and an array with all matches created for the user.
 */
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