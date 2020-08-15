const { UserModel } = require('../src/models/userModel')
const jestMongoose = require('jest-mongoose')
const { connect } = require('../src/database')

module.exports = jestMongoose({
    UserModel,
}, connect)