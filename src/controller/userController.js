const { UserModel } = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { secret } = require('../envConfig')
const bcrypt = require('bcryptjs')


/**
 * create user function: create in db the users of the sistem
 *
 * @param   {[string]}  userName  unique in the system
 * @param   {[string]}  email     unique in the system
 * @param   {[string]}  password  
 *
 * @return  {[object]}            returns an object with token properties
 */
async function createUser(userName, email, password) {

    if (!password) { return { error: "password cannot be undefined" } }

    const user = new UserModel({
        userName: String(userName),
        email: String(email),
        password: String(password)
    })

    try {

        const valid = await user.userValidations(user.userName, user.email)

        if (valid) {

            user.password = await user.encryptPass(user.password)

            await user.save()

            const token = await jwt.sign({ id: user._id }, secret)

            return { token: token }

        } else {

            return { error: "username or email not available" }

        }
    } catch (e) {
        return { message: "Invalid petition", error: e }
    }
}

/**
 * get user function
 *
 * @param   {string}  email     email dir of user
 * @param   {string}  password  password of acount
 *
 * @return  {object}            returns an object with token properties
 */
async function getUser(email, pass) {
    try {
        const user = await UserModel.findOne({ email: String(email) }).exec()
        pass = await bcrypt.compare(String(pass), user.password)

        if (user && pass) {
            const token = await jwt.sign({ id: user._id }, secret)
            return { token: token }
        } else {
            return { message: "email or password incorrect" }
        }
    } catch (e) {
        return { message: "Invalid data", error: e }
    }
}

module.exports = { createUser, getUser }