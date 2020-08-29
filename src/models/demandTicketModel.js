const { Schema, model } = require('mongoose')

const demandSchema = Schema({
    player: { type: String, required: true },
    match: { type: String, required: true },
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    message: { type: String },
}, { timestamps: true })

const DemandTicketModel = model('demandTicket', demandSchema)

module.exports = { DemandTicketModel, demandSchema }