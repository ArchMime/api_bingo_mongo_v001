const { Router } = require('express')
const matchRoutes = Router()
const { createMatch, getMatch, myMatches } = require('../controller/matchController')
const jwt = require('jsonwebtoken')
const { secret } = require('../envConfig')

matchRoutes.post('/newmatch', async(req, res) => {
    const { date, description } = req.body
    const token = req.body.token || req.headers['token']
    try {
        let response = await createMatch(date, description, token)
        if (response.token) {
            res.status(201).json(response)
        } else {
            res.status(401).json(response)
        }
    } catch (e) {
        console.log(e)
        res.status(418).json({ message: 'no cacho', error: e })
    }
})

matchRoutes.get('/getmatch', async(req, res) => {
    const { matchId } = req.body
    const token = req.body.token || req.headers['token']
    try {
        let response = await getMatch(matchId, token)
        if (response.token) {
            res.status(200).json(response)
        } else {
            res.status(401).json(response)
        }
    } catch (e) {
        console.log(e)
        res.status(418).json({ message: 'no cacho', error: e })
    }
})

matchRoutes.get('/mymatches', async(req, res) => {
    const token = req.body.token || req.headers['token']
    try {
        let response = await myMatches(token)
        if (response.token) {
            res.status(200).json(response)
        } else {
            res.status(401).json(response)
        }
    } catch (e) {
        console.log(e)
        res.status(418).json({ message: 'no cacho', error: e })
    }
})

module.exports = matchRoutes