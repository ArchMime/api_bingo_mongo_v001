const { DemandTicketModel } = require('../models/demandTicketModel')
const { MatchModel } = require('../models/matchModel')
const { UserModel } = require('../models/userModel')
const { loadModels, createTicket, createSerie } = require('./ticketController')

const jwt = require('jsonwebtoken')
const { secret } = require('../envConfig')

/**
 * demandTicket function
 *
 * @param   {token}  token     user validator
 * @param   {id}  matchId   match validator
 * @param   {string}  type      request type validator
 * @param   {number}  quantity  quantity of request, no required
 * @param   {string}  message   message of request, no required
 *
 * @return  {object}            return a object of type demandTicket
 */
async function newDemandTickets(token, matchId, type, quantity, message) {
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

            return demand

        } else {
            throw new Error('not found')
        }

    } catch (e) {
        return e
    }
}

/**
 * acceptDemand function
 *
 * @param   {token}  userToken  user validator
 * @param   {id}  demandId  demand validator
 *
 * @return  {[type]}             [return description]
 */
async function acceptDemand(userToken, demandId) {

    try {
        let objRequest = await DemandTicketModel.findById(demandId)
        let match = await MatchModel.findById(objRequest.match)

        if (!match.played) {
            let acceptTickets = []
            if (objRequest.type === 'ticket') {
                for (let i = 0; i < objRequest.quantity; i++) {
                    let aux = await createTicket(userToken, match._id, objRequest.player)
                    acceptTickets.push(aux)
                }
            } else if (objRequest.type === 'serie') {
                for (let i = 0; i < objRequest.quantity; i++) {
                    let aux = await createSerie(userToken, match._id, objRequest.player)
                    acceptTickets.push(aux)
                }
            } else {
                throw new Error('no type defined')
            }
            await DemandTicketModel.findByIdAndDelete(demandId)
            return acceptTickets

        } else {
            throw new Error('not found')
        }
    } catch (e) {
        return e
    }
}

/**
 * rejectDemand function
 *
 * @param   {token}  token      user validator
 * @param   {id}  demandId  demand validator
 *
 * @return  {string}             return confirm delete value
 */
async function rejectDemand(token, demandId) {
    try {
        let decode = await jwt.verify(token, secret)
        let user = await UserModel.findById(decode.id)
        let demand = await DemandTicketModel.findById(demandId)
        let auxMatch = await MatchModel.findById(demand.match)
        if (user._id == auxMatch.master) {
            await DemandTicketModel.findByIdAndDelete(demandId)
            return 'removed'
        }
    } catch (e) {
        return e
    }
}

/**
 * demandOfMiMatches
 *
 * @param   {token}  token  user validator
 *
 * @return  {array}         returns all demands for matches where user is master
 */
async function demandOfMyMatches(token) {
    try {
        let decodeUser = await jwt.verify(token, secret)
        let user = await UserModel.findById(decodeUser.id)

        let myMatches = await MatchModel.find({ master: user._id })
        let demands = []
        for (i = 0; i < myMatches.length; i++) {
            let aux = await DemandTicketModel.find({ match: myMatches[i]._id })
            demands.push(aux)
        }
        return demands
    } catch (e) {
        return e

    }
}

module.exports = { newDemandTickets, acceptDemand, rejectDemand, demandOfMyMatches }