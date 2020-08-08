const express = require('express')
const helmet = require('helmet')
const app = express()

app.use(helmet())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = {
  app
}
