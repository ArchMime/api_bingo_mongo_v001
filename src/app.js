const express = require('express')
const { apiVersion } = require('./envConfig')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(`${apiVersion}/`, userRoutes)

module.exports = app