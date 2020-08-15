const { UserModel } = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { secret } = require('../envConfig')


async function createUser(userName, email, password) {

    const user = new UserModel({
        userName,
        email,
        password
    })

    try {

        const valid = await user.userValidations(user.userName, user.email)

        if (valid) {

            user.password = await user.encryptPass(user.password)

            await user.save()

            const token = jwt.sign({ id: user._id }, secret)

            return { user: user, token: token }

        } else {

            return { error: "username or email not available" }

        }
    } catch (e) {
        console.log(e)
        return { message: "Invalid petition", error: e }
    }
}

module.exports = { createUser }