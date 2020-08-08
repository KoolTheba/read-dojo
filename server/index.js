require('dotenv').config()

const { app } = require('./server')
const debug = require('debug')('read-dojo:server')
const port = process.env.PORT

app.listen(port, () => {
  debug(`http server listening at http://localhost:${port}`)
})
