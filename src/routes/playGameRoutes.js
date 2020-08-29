const { Router } = require('express')
const playGameRoutes = Router()
const runPlayGame = require('../controller/playGameController')

playGameRoutes.post('/playgame', async(req, res) => {
    const { match } = req.body
    const token = req.body.token || req.headers['token']
    try {
        let response = await runPlayGame(token, match)
        res.status(201).json({ game: response })
    } catch (e) {
        console.log(e)
        res.status(418).json({ message: 'no cacho', error: e })
    }
})

module.exports = playGameRoutes