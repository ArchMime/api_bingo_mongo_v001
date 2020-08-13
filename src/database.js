const mongoose = require('mongoose')
const { dbHost, dbPort, dbName } = require('./envConfig')

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(db => console.log('db is connected'))
}