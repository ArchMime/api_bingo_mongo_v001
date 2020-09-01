const { TicketModel } = require('../models/ticketModel')
const { MatchModel } = require('../models/matchModel')
const { UserModel } = require('../models/userModel')

const jwt = require('jsonwebtoken')
const { secret } = require('../envConfig')

/**
 * loadModels function
 *
 * @param   {token}  token     User validator
 * @param   {id}  idMatch   match validator
 * @param   {token}  idPlayer  User validator
 *
 * @return  {object}            returned an object with user match and player
 */
async function loadModels(token, idMatch, idPlayer = 0) {
    let decodeUser = await jwt.verify(token, secret)
    let user = await UserModel.findById(decodeUser.id)
    let match = await MatchModel.findById(idMatch)
    let player
    if (idPlayer != 0) {
        player = await UserModel.findById(idPlayer)
    } else {
        player = null
    }

    return { user, match, player }
}

/**
 * createTicket function
 *
 * @param   {token}  userToken    user validator
 * @param   {id}  matchId   match validator
 * @param   {id}  playerId  user validator
 *
 * @return  {object}          returned an object with token of user and tiket
 */
async function createTicket(userToken, matchId, playerId) {
    try {
        const { user, match, player } = await loadModels(userToken, matchId, playerId)

        if (player && user._id == match.master && !match.played) {
            const ticket = new TicketModel({
                match: match._id,
                player: player._id
            })
            ticket.numbers = ticket.createNumbers()
            await ticket.save()

            return ticket
        } else {
            throw new Error('unauthorized')
        }
    } catch (e) {
        return e
    }

}

/**
 * create serie function
 *
 * @param   {token}  userToken  user validator
 * @param   {id}  matchId    match validator
 * @param   {id}  playerId   user validator
 *
 * @return  {array}             return array whit new tickets
 */
async function createSerie(userToken, matchId, playerId) {
    try {
        const { user, match, player } = await loadModels(userToken, matchId, playerId)
        if (player && user._id == match.master && !match.played) {
            const auxTicket = new TicketModel({
                match: match._id,
                player: player._id
            })
            let serie = []

            let auxSerie = auxTicket.createNumbersOfSerie()

            for (i = 0; i < 6; i++) {

                const ticket = new TicketModel({
                    match: match._id,
                    player: player._id,
                    numbers: [],
                    serie: auxTicket._id
                })

                ticket.numbers = auxSerie[i]

                await ticket.save()

                serie.push(ticket)
            }
            return serie
        } else {
            throw new Error('unauthorized')
        }
    } catch (e) {
        return e
    }
}

/**
 * get ticket of match function
 *
 * @param   {token}  userToken  user validator
 * @param   {id}  matchId    match validator
 *
 * @return  {array}             return array with ticket belonging to the match
 */
async function getAllTicketOfMatch(userToken, matchId) {
    try {
        const { user, match } = await loadModels(userToken, matchId)
        if (user._id == match.master) {
            let tickets = await TicketModel.find({ match: match._id })

            return tickets
        } else {
            throw new Error('unauthorized')
        }

    } catch (e) {
        return e
    }
}

/**
 * get all my tickets function
 *
 * @param   {token}  token  user validator
 *
 * @return  {array}         array with all tickets of user
 */
async function getAllMyTickets(token) {
    try {
        let decode = await jwt.verify(token, secret)

        let myTickets = await TicketModel.find({ player: decode.id })

        return myTickets

    } catch (e) {
        return e
    }
}

/**
 * my tickets of match
 *
 * @param   {token}  token    user validator
 * @param   {id}  matchId  match validator
 *
 * @return  {array}           return all tickets of user in the match
 */
async function myTicketsOfMatch(token, matchId) {
    try {
        const { user, match } = await loadModels(token, matchId)

        let myTicketsOfMatch = await TicketModel.find({ player: user._id, match: match._id })

        return myTicketsOfMatch

    } catch (e) {
        return e
    }
}

module.exports = { createTicket, createSerie, getAllTicketOfMatch, getAllMyTickets, myTicketsOfMatch, loadModels }