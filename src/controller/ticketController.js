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
        let decodePlayer = await jwt.verify(idPlayer, secret)
        player = await UserModel.findById(decodePlayer.id)
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
 * @param   {token}  playerToken  user validator
 *
 * @return  {object}          returned an object with token of user and tiket
 */
async function createTicket(userToken, matchId, playerToken) {
    try {
        const { user, match, player } = await loadModels(userToken, matchId, playerToken)

        if (player && user._id == match.master && !match.played) {
            const ticket = new TicketModel({
                match: match._id,
                player: player._id
            })
            ticket.numbers = ticket.createNumbers()
            await ticket.save()

            return { token: userToken, ticket: ticket }
        } else {
            return { message: 'not found' }
        }
    } catch (e) {
        return { message: "Invalid data", error: e }
    }

}

async function createSerie(userToken, matchId, playerToken) {
    try {
        const { user, match, player } = await loadModels(userToken, matchId, playerToken)

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
            return { token: userToken, serie: serie }
        } else {
            return { message: 'not found' }
        }
    } catch (e) {
        return { message: "Invalid data", error: e }
    }
}

async function getTicketOfMatch(userToken, matchId) {
    try {
        const { user, match } = await loadModels(userToken, matchId)
        if (user._id == match.master) {
            let tickets = await TicketModel.find({ match: match._id })

            return { token: userToken, tickets: tickets }
        } else {
            return { message: 'not found' }
        }

    } catch (e) {
        return { message: "Invalid data", error: e }
    }
}

async function getAllMyTickets(token) {
    try {
        let decode = await jwt.verify(token, secret)

        let myTickets = await TicketModel.find({ player: decode.id })

        return { token: token, myTickets: myTickets }

    } catch (e) {
        return { message: "Invalid data", error: e }
    }
}

module.exports = { createTicket, createSerie, getTicketOfMatch, getAllMyTickets }