const mongoose = require('mongoose')
const { dbHost, dbPort, dbName } = require('./envConfig')


const connect = () => new Promise((resolve, reject) => {

    mongoose.set('useNewUrlParser', true)
    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex', true)
    mongoose.set('useUnifiedTopology', true)

    mongoose.connection.on('connected', () => {
        resolve();
    });

    try {

        mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`).then(resolve, reject)

    } catch (e) {
        reject(e)
    }
})

module.exports = { connect }