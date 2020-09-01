const { Router } = require('express')
const demandRoutes = Router()
const { newDemandTickets, acceptDemand, rejectDemand } = require('../controller/demandTicketController')

demandRoutes.post('/newdemand', async(req, res) => {
    const { match, type, quantity, message } = req.body
    const token = req.body.token || req.headers['token']
    try {
        let demand = await newDemandTickets(token, match, type, quantity, message)
        res.status(201).json({ message: 'success', demand: demand })

    } catch (e) {
        res.status(401).json(e)
    }
})

demandRoutes.post('/aceptdemand', async(req, res) => {
    const { requestId, playerId } = req.body
    const token = req.body.token || req.headers['token']
    try {
        let acepted = await acceptDemand(token, requestId, playerId)

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

        res.status(201).json({ message: reject })

    } catch (e) {
        res.status(401).json(e)
    }
})
module.exports = demandRoutes