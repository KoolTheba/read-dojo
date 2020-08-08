const mongoose = require('mongoose')
const dbName = process.env.DB_NAME
const dbUrl = process.env.DB_URL
const Resource = require('./models/resource')

mongoose.connect(`mongodb://${dbUrl}/${dbName}`, {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.set('debug', true)
mongoose.set('useCreateIndex', true)

mongoose.Promise = Promise

module.exports = { Resource }
