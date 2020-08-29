const { Router } = require('express')
const demandRoutes = Router()
const { requestTickets, acceptRequest, rejectDemand } = require('../controller/demandTicketController')

demandRoutes.post('/newdemand', async(req, res) => {
    const { match, type, quantity, message } = req.body
    const token = req.body.token || req.headers['token']
    try {
        let demand = await requestTickets(token, match, type, quantity, message)
        res.status(201).json({ message: 'success', demand: demand.ticketRequest })

    } catch (e) {
        res.status(401).json(e)
    }
})

demandRoutes.post('/aceptdemand', async(req, res) => {
    const { requestId, playerId } = req.body
    const token = req.body.token || req.headers['token']
    try {
        let acepted = await acceptRequest(token, requestId, playerId)

        res.status(201).json({ message: 'success', newTickets: acepted })

    } catch (e) {
        res.status(401).json(e)
    }
})

demandRoutes.post('/rejectdemand', async(req, res) => {
    const { requestId } = req.body
    const token = req.body.token || req.headers['token']
    try {
        let reject = await rejectDemand(token, requestId)

        res.status(201).json({ message: reject.message })

    } catch (e) {
        res.status(401).json(e)
    }
})
module.exports = demandRoutes