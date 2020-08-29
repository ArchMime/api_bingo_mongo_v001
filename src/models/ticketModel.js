const { Schema, model } = require('mongoose')


const TicketSchema = new Schema({
    match: { type: String, required: true },
    player: { type: String, required: true },
    numbers: { type: Array },
    lines: { type: Array },
    serie: { type: String }
}, { timestamps: true })

function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random())
}

/**
 * selectNumbers function
 *
 * @param   {Array} number  list of numbers between 1 and 90
 * @param   {Array}  numbersInTicket  numbers belonging to the ticket
 *
 * @return  {object}                   return a object whit remaining numbers and ticket
 */
function selectNumbers(number, numbersInTicket) {
    for (e = 0; e < 3; e++) {
        let auxArray = []
        for (a = 0; a < 5; a++) {
            let index = randomInt(0, number.length)
            auxArray.push(number[index])

            number.splice(index, 1)
        }
        numbersInTicket.push(auxArray)
    }
    let ticket = numbersInTicket
    let remainingNumbers = number
    return { remainingNumbers, ticket }
}

/**
 * createNumbers method
 *
 * @return  {array}  returned an array with 15 ramdon numbers
 */
TicketSchema.methods.createNumbers = () => {
    let number = []
    let numbersInTicket = []
    for (i = 1; i <= 90; i++) {
        number.push(i)
    }
    let { ticket } = selectNumbers(number, numbersInTicket)
    return ticket
}

/**
 * createNumbersOfSerie method
 *
 * @return  {array}  return an array with 6 non-repeating tickets
 */
TicketSchema.methods.createNumbersOfSerie = () => {
    let number = []
    let ticketSerie = []
    for (o = 1; o <= 90; o++) {
        number.push(o)
    }
    for (i = 0; i < 6; i++) {
        let numbersInTicket = []
        let { remainingNumbers, ticket } = selectNumbers(number, numbersInTicket)

        number = remainingNumbers
        ticketSerie.push(ticket)
    }
    return ticketSerie

}

const TicketModel = model('tickets', TicketSchema)

module.exports = { TicketModel, TicketSchema }