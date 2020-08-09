require('dotenv').config()

const { app } = require('./server')
const debug = require('debug')('read-dojo:server')
const port = process.env.PORT
const dbName = process.env.DB_NAME
const dbUrl = process.env.DB_URL
const { dbInit } = require('./stores')

dbInit(dbUrl, dbName).then(() => {
  app.listen(port, () => {
    debug(`http server listening at http://localhost:${port}`)
  })
})
