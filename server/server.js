const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const app = express()
const { Resource } = require('./stores')
const { successHandler, errorsDescription } = require('./utils')

app.use(bodyParser.json())
app.use(helmet())

app.get('/api/v1/resources', async (req, res, next) => {
  try {
    const resources = await Resource.fetchAll()
    return successHandler(res, resources)
  } catch (err) {
    next(errorsDescription.genericError)
  }
})

app.get('/api/v1/resources/:resourceId', async (req, res, next) => {
  try {
    const { resourceId } = req.params
    const resource = await Resource.fetchOne(resourceId)
    return resource ? successHandler(res, resource) : next(errorsDescription.notFound)
  } catch (err) {
    next(errorsDescription.genericError)
  }
})

app.post('/api/v1/resources', async (req, res, next) => {
  try {
    const { body } = req
    const resource = await Resource.create(body)
    return successHandler(res, resource)
  } catch (err) {
    next(errorsDescription.genericError)
  }
})

app.put('/api/v1/resources/:resourceId', async (req, res, next) => {
  try {
    const { body, params: { resourceId } } = req
    const resource = await Resource.update(resourceId, body)
    return resource ? successHandler(res, resource) : next(errorsDescription.notFound)
  } catch (err) {
    next(errorsDescription.genericError)
  }
})

app.delete('/api/v1/resources/:resourceId', async (req, res, next) => {
  try {
    const { resourceId } = req.params
    const resource = await Resource.delete(resourceId)
    return resource ? successHandler(res, resource) : next(errorsDescription.notFound)
  } catch (err) {
    next(errorsDescription.genericError)
  }
})

app.use((err, req, res, next) => {
  return res.status(err.status || 400).json({
    status: err.status || 400,
    message: err.message || 'there was an error processing request'
  })
})

module.exports = {
  app
}
