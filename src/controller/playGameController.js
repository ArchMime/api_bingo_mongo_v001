const { DemandTicketModel } = require('../models/demandTicketModel')
const { MatchModel } = require('../models/matchModel')
const { UserModel } = require('../models/userModel')
const { TicketModel } = require('../models/ticketModel')
const { PlayGameModel } = require('../models/playGameModel')
const { matchesThatIPlay } = require('./matchController')


const jwt = require('jsonwebtoken')
const { secret } = require('../envConfig')

/**
 * runPlayGame function
 *
 * @param   {toke}  token    user validator
 * @param   {id}  matchId  match validator
 *
 * @return  {playGameObject}           return a object with data of game
 */
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

                            playGame.winningLines.push(ticketsMatch[i])
                            playGame.roundsForLine = roundIndex + 1 //I don't understand why it doesn't work ++roundIndex
                            playGame.numberOfWinningLines = Number(playGame.numberOfWinningLines) + Number(1)
                        }

                        //evaluates if a ticket was completed
                        if (ticketsMatch[i].lines[0] == 'xxxxx' && ticketsMatch[i].lines[1] == 'xxxxx' && ticketsMatch[i].lines[2] == 'xxxxx') {
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

        await playGame.save()

        match.played = true

        await match.save()

        return playGame

    } catch (e) {
        return e
    }

}


/**
 * myVictory fuction
 *
 * @param   {token}  token  user validator
 *
 * @return  {array}         return a array with winer ticket of the user
 */
async function myVictory(token) {
    try {
        const decode = await jwt.verify(token, secret)

        let matches = await matchesThatIPlay(token)

        let gamesOver = []

        for (let i = 0; i < matches.length; i++) {
            let games = await PlayGameModel.findOne({ match: matches[i]._id });
            if (games) {
                gamesOver.push(games)
            }
        }


        let myLinesWin = []
        let myMatchesWin = []

        for (let a = 0; a < gamesOver.length; a++) {

            for (let b = 0; b < gamesOver[a].winningLines.length; b++) {

                if (gamesOver[a].winningLines[b].player == decode.id) {
                    myLinesWin.push(gamesOver[a].winningLines[b])
                }
            }

            for (let c = 0; c < gamesOver[a].winningTickets.length; c++) {

                if (gamesOver[a].winningTickets[c].player == decode.id) {
                    myMatchesWin.push(gamesOver[a].winningTickets[c])
                }
            }
        }

        let myWins = {
            linesWin: myLinesWin,
            matchesWin: myMatchesWin
        }

        return myWins

    } catch (e) {
        return e
    }
}

module.exports = { runPlayGame, myVictory }