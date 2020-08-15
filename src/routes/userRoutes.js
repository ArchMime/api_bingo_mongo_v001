const { Router } = require('express')
const userRouter = Router()
    //const { UserModel } = require('../models/usermodel')
const jwt = require('jsonwebtoken')
const { secret } = require('../envConfig')

userRouter.post('/singin', () => {})


module.exports = userRouter