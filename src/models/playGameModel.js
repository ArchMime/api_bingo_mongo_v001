const { Schema, model } = require('mongoose')


const PlayGameSchema = new Schema({
    match: { type: String, required: true },
    winningLines: { type: Array },
    winningTickets: { type: Array },
    numbersPlayed: { type: Array },
    roundsPlayed: { type: Number },
    roundsForLine: { type: Number },
    numberOfWinningLines: { type: Number, default: 0 },
    numberOfWinningTickets: { type: Number, default: 0 }
}, { timestamps: true })


const PlayGameModel = model('playGame', PlayGameSchema)

module.exports = { PlayGameModel, PlayGameSchema }