const { DemandTicketModel } = require('../models/demandTicketModel')
const { MatchModel } = require('../models/matchModel')
const { UserModel } = require('../models/userModel')
const { TicketModel } = require('../models/ticketModel')
const { PlayGameModel } = require('../models/playGameModel')


const jwt = require('jsonwebtoken')
const { secret } = require('../envConfig')

async function runPlayGame(token, matchId) {
    try {
        const decode = await jwt.verify(token, secret)
        const user = await UserModel.findById(decode.id)
        const match = await MatchModel.findById(matchId)

        //validate this play
        if (!user || !match) {
            throw new Error('no data provided')
        } else if (user._id != match.master) {
            throw new Error('Unauthorized')
        } else if (match.played) {
            throw new Error('game over')
        }

        const demands = await DemandTicketModel.find({ match: match._id })
        const ticketsMatch = await TicketModel.find({ match: match._id })


        if (demands[0]) {
            throw new Error('Pending demands')
        }

        const playGame = new PlayGameModel({
            match: match._id
        })

        //create auxiliary attributes for evaluate the numbers played
        for (let i = 0; i < ticketsMatch.length; i++) {
            ticketsMatch[i].lines = [
                '',
                '',
                ''
            ]
        }
        let over = false
        let numbers = []
        let playedNumbers = []

        for (let n = 1; n <= 90; n++) {
            numbers.push(n)
        }


        function randomInt(min, max) {
            return min + Math.floor((max - min) * Math.random())
        }

        for (let roundIndex = 0; roundIndex < 90; roundIndex++) {
            let index = randomInt(0, numbers.length)
            playedNumbers.push(numbers[index])

            for (let i = 0; i < ticketsMatch.length; i++) {
                for (let iAux = 0; iAux < 3; iAux++) {
                    if (ticketsMatch[i].lines[iAux] != 'xxxxx' && ticketsMatch[i].numbers[iAux].includes(numbers[index])) {
                        ticketsMatch[i].lines[iAux] += 'x'

                        //evaluates if a line was completed
                        if ((!playGame.winningLines[0] || playGame.roundsForLine == roundIndex + 1) && ticketsMatch[i].lines[iAux] === 'xxxxx') {
                            // console.log('entra al win line,vuelta: ' + (roundIndex + 1))
                            // console.log(ticketsMatch[i])
                            playGame.winningLines.push(ticketsMatch[i])
                            playGame.roundsForLine = roundIndex + 1 //I don't understand why it doesn't work ++roundIndex
                            playGame.numberOfWinningLines = Number(playGame.numberOfWinningLines) + Number(1)
                        }

                        //evaluates if a ticket was completed
                        if (ticketsMatch[i].lines[0] == 'xxxxx' && ticketsMatch[i].lines[1] == 'xxxxx' && ticketsMatch[i].lines[2] == 'xxxxx') {
                            // console.log('entra al win game, vuelta: ' + (roundIndex + 1))
                            // console.log(ticketsMatch[i])
                            playGame.winningTickets.push(ticketsMatch[i])
                            playGame.numberOfWinningTickets = Number(playGame.numberOfWinningTickets) + Number(1)
                            over = true
                        }
                    }
                }

            }

            numbers.splice(index, 1)

            if (over) {
                playGame.roundsPlayed = roundIndex + 1
                break
            }
        }

        playGame.numbersPlayed = playedNumbers

        // console.log(playGame)

        await playGame.save()

        match.played = true

        await match.save()

        return playGame

    } catch (e) {
        return e
    }

}

module.exports = runPlayGame