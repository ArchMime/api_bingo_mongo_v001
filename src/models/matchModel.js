const { Schema, model } = require('mongoose')

const MatchSchema = Schema({
    master: { type: String, required: true },
    date: { type: Date },
    description: { type: String },
    played: { type: Boolean, default: false },
}, { timestamps: true })

const MatchModel = model('match', MatchSchema)

module.exports = { MatchModel, MatchSchema }