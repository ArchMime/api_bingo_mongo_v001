const { Schema, model, models } = require('mongoose')
const bcrypt = require('bcryptjs')


const UserSchema = new Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true }
}, { timestamps: true })

UserSchema.methods.encryptPass = async(pass) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(pass, salt)
}


UserSchema.methods.userValidations = async(userName) => {

    let userCount = await models.users.countDocuments({ userName })

    return !userCount

}

const UserModel = model('users', UserSchema)

module.exports = { UserModel, UserSchema }