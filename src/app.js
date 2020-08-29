const express = require('express')
const { apiVersion } = require('./envConfig')
const userRoutes = require('./routes/userRoutes')
const matchRoutes = require('./routes/matchRoutes')
const demandRoutes = require('./routes/demandTicketRoutes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(`${apiVersion}/users`, userRoutes)
app.use(`${apiVersion}/matches`, matchRoutes)
app.use(`${apiVersion}/demandTicket`, demandRoutes)

module.exports = app