const { DemandTicketModel } = require('../models/demandTicketModel')
const { MatchModel } = require('../models/matchModel')
const { UserModel } = require('../models/userModel')
const { loadModels, createTicket, createSerie } = require('./ticketController')

const jwt = require('jsonwebtoken')
const { secret } = require('../envConfig')


async function requestTickets(token, matchId, type, quantity, message) {
    try {
        const { user, match } = await loadModels(token, matchId)
        if (user && match && !match.played) {
            let demand = new DemandTicketModel({
                player: user._id,
                match: match._id,
                type: type,
                quantity: quantity,
                message: message,
            })

            await demand.save()

            return { ticketRequest: demand }

        } else {
            return { message: 'not found' }
        }

    } catch (e) {
        return { message: "Invalid data", error: e }
    }
}

async function acceptRequest(userToken, requestId, playerId) {

    try {
        let objRequest = await DemandTicketModel.findById(requestId)
        let match = await MatchModel.findById(objRequest.match)

        if (!match.played) {
            let acceptTickets = []
            if (objRequest.type === 'ticket') {
                for (let i = 0; i < objRequest.quantity; i++) {
                    let aux = await createTicket(userToken, match._id, playerId)
                    acceptTickets.push(aux.ticket)
                }
            } else if (objRequest.type === 'serie') {
                for (let i = 0; i < objRequest.quantity; i++) {
                    let aux = await createSerie(userToken, match._id, playerId)
                    acceptTickets.push(aux.serie)
                }
            } else {
                return { message: 'no type defined' }
            }
            await DemandTicketModel.findByIdAndDelete(requestId)
            return { acceptTickets: acceptTickets }

        } else {
            return { message: 'not found' }
        }
    } catch (e) {
        return { message: "Invalid data", error: e }
    }
}

async function rejectDemand(token, requestId) {
    try {
        let decode = await jwt.verify(token, secret)
        let user = await UserModel.findById(decode.id)
        let demand = await DemandTicketModel.findById(requestId)
        let auxMatch = await MatchModel.findById(demand.match)
        if (user._id == auxMatch.master) {
            await DemandTicketModel.findByIdAndDelete(requestId)
            return { message: 'removed' }
        }
    } catch (e) {
        return { message: "Invalid data", error: e }
    }
}

async function requestOfMyMatches(token) {
    try {
        let decodeUser = await jwt.verify(token, secret)
        let user = await UserModel.findById(decodeUser.id)

        let myMatches = await MatchModel.find({ master: user._id })
        let demands = []
        for (i = 0; i < myMatches.length; i++) {
            let aux = await DemandTicketModel.find({ match: myMatches[i]._id })
            demands.push(aux)
        }
        return { demands: demands }
    } catch (e) {
        return { message: "Invalid data", error: e }

    }
}

module.exports = { requestTickets, acceptRequest, rejectDemand, requestOfMyMatches }