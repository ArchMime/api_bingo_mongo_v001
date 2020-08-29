const { Router } = require('express')
const userRouter = Router()
const { createUser, getUser } = require('../controller/userController')


userRouter.post('/singin', async(req, res) => {
    const { userName, email, password } = req.body
    try {
        const response = await createUser(userName, email, password)

        if (response.token) {
            res.status(201).json({ token: response.token })
        } else {
            res.status(400).json({ error: response.error, message: 'alguna wea pasa' })
        }
    } catch (e) {
        console.log(e)
        res.status(418).json({ message: 'no cacho', error: e })
    }


})


userRouter.post('/login', async(req, res) => {
    const { email, password } = req.body
    try {
        const response = await getUser(email, password)

        if (response.token) {
            res.status(200).json({ token: response.token })
        } else {
            res.status(400).json(response)
        }
    } catch (e) {
        console.log(e)
        res.status(418).json({ message: 'no cacho', error: e })
    }
})

module.exports = userRouter