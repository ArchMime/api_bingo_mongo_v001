const { MatchModel } = require('../models/matchModel')
const { UserModel } = require('../models/userModel')
const { TicketModel } = require('../models/ticketModel')
const { getAllTicketOfMatch, myTicketsOfMatch } = require('./ticketController')
const jwt = require('jsonwebtoken')
const { secret } = require('../envConfig')

/**
 * createMatch function
 *
 * @param   {Date}  date        date the game was played
 * @param   {String}  descrption  Information relevant to the match
 * @param   {Token}  token       User validator
 *
 * @return  {Object}              the function returns an new object match
 */
async function createMatch(date, descrption, token) {

    try {

        let decode = await jwt.verify(token, secret)
        let user = await UserModel.findById(decode.id)

        if (!user) throw new Error('Invalid data')

        let match = new MatchModel({
            master: user._id,
            date: date,
            description: descrption
        })

        await match.save()

        return match


    } catch (e) {
        return e
    }
}

/**
 * getMatch function
 *
 * @param   {id}  matchId  id of the match to play
 * @param   {token}  token    user validator
 *
 * @return  {Object}           the function returns an object composed of a master validator and a match
 */
async function getMatch(matchId, token) {

    try {
        let regex = /^[a-fA-F0-9]{24}$/;

        if (!regex.test(matchId)) throw new Error('invalid match identifier')

        let decode = await jwt.verify(token, secret)
        let user = await UserModel.findById(decode.id)
        let match = await MatchModel.findById(matchId)

        if (!match) throw new Error('match not found')

        let allTicketsOfThisMatch = await getAllTicketOfMatch(token, matchId)
        let myTicketsOfThisMatch = await myTicketsOfMatch(token, matchId)
        isMaster = (user._id == match.master)

        return { match, isMaster, allTicketsOfThisMatch, myTicketsOfThisMatch }

    } catch (e) {
        return e
    }
}

/**
 * myMatches function returns all matches where user is master
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
            return { matches: matches, isMaster: true }
        } else {
            return { message: 'not found' }
        }
    } catch (e) {
        return e
    }
}

/**
 * getAllMatches function returned all matches no played
 *
 * @param   {token}  token  user validator
 *
 * @return  {array}         returned an array of matches object
 */
async function getAllMatches(token) {
    try {
        let decode = await jwt.verify(token, secret)
        let user = await UserModel.findById(decode.id)

        if (!user) throw new Error('unauthorized')

        let matches = await MatchModel.find({ played: false })

        return matches
    } catch (e) {
        return e
    }
}

/**
 * matchesThatIPlay function returns all match where user is a player
 *
 * @param   {token}  token   user validator
 *
 * @return  {array}         array of matches object
 */
async function matchesThatIPlay(token) {
    try {
        const decode = await jwt.verify(token, secret)
        const user = await UserModel.findById(decode.id)

        if (!user) throw new Error('no data provided')

        const tickets = await TicketModel.find({ player: user._id })

        const idMatches = []

        for (let i = 0; i < tickets.length; i++) {

            if (!idMatches.includes(tickets[i].match)) {
                idMatches.push(tickets[i].match)
            }
        }

        let matches = []
        for (let i = 0; i < idMatches.length; i++) {
            let aux = await MatchModel.findById({ _id: idMatches[i] })
            matches.push(aux)
        }

        return matches

    } catch (e) {
        return e
    }
}

module.exports = { createMatch, getMatch, myMatches, getAllMatches, matchesThatIPlay }