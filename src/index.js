require('dotenv').config()
const app = require('./app')
require('./database')
const { port, apiVersion } = require('./envConfig')

async function server() {
    await app.listen(port)
    console.log(apiVersion)
    console.log(`server on port ${port}`)
}

server()

module.exports = server