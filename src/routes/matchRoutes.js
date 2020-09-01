const { Router } = require('express')
const matchRoutes = Router()
const { createMatch, getMatch } = require('../controller/matchController')
const playGameRoutes = require('./playGameRoutes')


matchRoutes.post('/newmatch', async(req, res) => {
    const { date, description } = req.body
    const token = req.body.token || req.headers['token']

    let response = await createMatch(date, description, token)
    if (response._id) {
        res.status(201).json(response)
    } else {
        res.status(401).json(response)
    }
})

matchRoutes.get('/getmatch', async(req, res) => {
    const { matchId } = req.body
    const token = req.body.token || req.headers['token']
    let response = await getMatch(matchId, token)
    if (response.match) {
        res.status(200).json(response)
    } else {
        res.status(401).json(response)
    }

})


matchRoutes.use('/', playGameRoutes)

module.exports = matchRoutes