const { Router } = require('express')
const userRouter = Router()
const { createUser, getUser } = require('../controller/userController')


userRouter.post('/singin', async(req, res) => {
    const { userName, password } = req.body
    const response = await createUser(userName, password)
    if (response.token) {
        res.status(201).json(response)
    } else {
        res.status(400).json({ message: response.message })
    }
})


userRouter.post('/login', async(req, res) => {
    const { userName, password } = req.body

    const response = await getUser(userName, password)

    if (response.token) {
        res.status(200).json(response)
    } else {
        res.status(400).json({ message: response.message })
    }

})

module.exports = userRouter