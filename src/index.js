require('dotenv').config()
const app = require('./app')
const { connect } = require('./database')
const { port } = require('./envConfig')

async function server() {
    await app.listen(port)
    console.log(`server on port ${port}`)
}



connect()
    .then(() => { server() })
    .catch((e) => {
        console.error(e);
    });

module.exports = server