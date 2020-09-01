const { Router } = require('express')
const homeRoutes = Router()
const { myMatches, matchesThatIPlay, getAllMatches } = require('../controller/matchController')
const { getAllMyTickets } = require('../controller/ticketController')
const { demandOfMyMatches } = require('../controller/demandTicketController')

homeRoutes.get('/', async(req, res) => {
    const token = req.body.token || req.headers['token']
    try {

        let mMatches = await myMatches(token)
        let allMatches = await getAllMatches(token)
        let allTickets = await getAllMyTickets(token)
        let myDemands = await demandOfMyMatches(token)
        let gamesThatIPlay = await matchesThatIPlay(token)

        res.status(200).json({ allMatches, mMatches, allTickets, myDemands, gamesThatIPlay })
    } catch (e) {
        res.status(400).json(e)
    }

})


module.exports = homeRoutes