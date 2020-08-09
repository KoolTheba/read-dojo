const mongoose = require('mongoose')
const Resource = require('./models/resource')
const debug = require('debug')('read-dojo:store')

const dbInit = async (dbUrl, dbName) => {
  debug('Initializing mongodb connection')
  mongoose.set('debug', true)
  mongoose.set('useCreateIndex', true)
  mongoose.Promise = Promise

  await mongoose.connect(`mongodb://${dbUrl}/${dbName}`, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  debug('mongodb has been initialized succesfully!')
}

module.exports = { Resource, dbInit }
