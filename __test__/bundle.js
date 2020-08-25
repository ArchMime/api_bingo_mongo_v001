const { UserModel } = require('../src/models/userModel')
const { MatchModel } = require('../src/models/matchModel')
const { TicketModel } = require('../src/models/ticketModel')
const jestMongoose = require('jest-mongoose')
const { connect } = require('../src/database')

module.exports = jestMongoose({
    UserModel,
    MatchModel,
    TicketModel,
}, connect)