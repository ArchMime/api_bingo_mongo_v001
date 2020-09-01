const { UserModel } = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { secret } = require('../envConfig')
const bcrypt = require('bcryptjs')


/**
 * create user function: create in db the users of the sistem
 *
 * @param   {[string]}  userName  unique in the system
 * @param   {[string]}  password  password of acount
 *
 * @return  {[object]}            returns an object with token properties
 */
async function createUser(userName, password) {

    try {

        if (!userName) throw new Error("userName cannot be undefined")

        if (!password) throw new Error("password cannot be undefined")

        const user = new UserModel({
            userName: String(userName),
            password: String(password)
        })

        const valid = await user.userValidations(user.userName)

        if (valid) {

            user.password = await user.encryptPass(user.password)

            await user.save()

            const token = await jwt.sign({ id: user._id }, secret)

            return { token: token, user: user.userName }

        } else {

            throw new Error("username not available")

        }
    } catch (e) {
        return e
    }
}

/**
 * get user function
 *
 * @param   {string}  userName     user name dir of user
 * @param   {string}  password     password of acount
 *
 * @return  {object}            returns an object with token properties an username
 */
async function getUser(userName, pass) {
    try {
        const user = await UserModel.findOne({ userName: String(userName) }).exec()
        if (!user) throw new Error("userName or password incorrect")

        pass = await bcrypt.compare(String(pass), user.password)

        if (!pass) throw new Error("userName or password incorrect")

        const token = await jwt.sign({ id: user._id }, secret)

        return { token: token, user: user.userName }

    } catch (e) {
        return e
    }
}

module.exports = { createUser, getUser }