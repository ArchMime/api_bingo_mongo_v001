const { Schema, model, models } = require('mongoose')
const bcrypt = require('bcryptjs')


const UserSchema = new Schema({
    userName: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true }
}, { timestamps: true })

UserSchema.methods.encryptPass = async(pass) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(pass, salt)
}


UserSchema.methods.userValidations = async(userName, email) => {

    let userCount = await models.users.countDocuments({ userName })

    let emailCount = await models.users.countDocuments({ email })

    let regex = /\S+@\S+\.\S+/;

    if (regex.test(email) && !userCount && !emailCount) {

        return true

    } else {

        return false

    }

}

const UserModel = model('users', UserSchema)

module.exports = { UserModel, UserSchema }