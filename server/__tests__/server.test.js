require('dotenv').config()
const request = require('supertest')
const { app } = require('../server')
const dbName = process.env.DB_NAME
const dbUrl = process.env.DB_URL
const { Resource, dbInit } = require('../stores')
const { addResources, resetDb, fixtures } = require('./helpers')

const emptyData = {}

beforeAll(() => dbInit(dbUrl, dbName))
beforeEach(resetDb)
afterAll(resetDb)

describe('Api server test', () => {
  describe('[GET] api/v1/resources', () => {
    test('Should return an array of resources stored', async () => {
      await addResources()
      const response = await request(app).get('/api/v1/resources')
      expect(response.res.headers['content-type']).toMatch('application/json')
      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual(fixtures.resourceList)
    })

    test('Should return an empty array if no resources are stored', async () => {
      const response = await request(app).get('/api/v1/resources')
      expect(response.res.headers['content-type']).toMatch('application/json')
      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual([])
    })
  })

  describe('[GET] api/v1/resources/:id', () => {
    test('Should return the details of a stored resource', async () => {
      await addResources()
      const response = await request(app).get(`/api/v1/resources/${fixtures.resourceValidId}`)
      expect(response.res.headers['content-type']).toMatch('application/json')
      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual(fixtures.resourceList[0])
    })

    test('Should return a 404 error if the resource does not exist', async () => {
      const response = await request(app).get(`/api/v1/resources/${fixtures.resourceUselessId}`)
      expect(response.res.headers['content-type']).toMatch('application/json')
      expect(response.statusCode).toBe(404)
      expect(response.body).toEqual(fixtures.errors.notFound)
    })
  })

  describe('[POST] api/v1/resources', () => {
    test('Should create and store a resource', async () => {
      const resourceData = fixtures.createResourceData

      const response = await request(app)
        .post('/api/v1/resources')
        .send(resourceData)
        .set('Accept', 'application/json')
      expect(response.res.headers['content-type']).toMatch('application/json')
      expect(response.statusCode).toBe(200)
      expect(response.body.url).toEqual(resourceData.url)
      expect(response.body.title).toEqual(resourceData.title)

      const storedResources = await Resource.fetchAll()
      expect(storedResources).toHaveLength(1)
      expect(storedResources[0].url).toEqual(resourceData.url)
      expect(storedResources[0].title).toEqual(resourceData.title)
    })

    test('Should not create or store a resouce if the payload is wrong', async () => {
      const response = await request(app)
        .post('/api/v1/resources')
        .send(emptyData)
        .set('Accept', 'application/json')
      expect(response.res.headers['content-type']).toMatch('application/json')
      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual(fixtures.errors.genericError)

      const storedResources = await Resource.fetchAll()
      expect(storedResources).toHaveLength(0)
    })
  })

  describe('[PUT] api/v1/resources/:id', () => {
    const resourceData = fixtures.updateResourceData

    test('Should update a resource if the data is correct', async () => {
      await addResources()

      const response = await request(app)
        .put(`/api/v1/resources/${fixtures.resourceValidId}`)
        .send(resourceData)
        .set('Accept', 'application/json')
      expect(response.res.headers['content-type']).toMatch('application/json')
      expect(response.statusCode).toBe(200)
      expect(response.body.title).toEqual(resourceData.title)

      const storedResources = await Resource.fetchOne(fixtures.resourceValidId)
      expect(storedResources.title).toEqual(resourceData.title)
    })

    test('Should not update a resouce if the id is wrong', async () => {
      await addResources()

      const response = await request(app)
        .put(`/api/v1/resources/${fixtures.resourceUseLessId}`)
        .send(resourceData)
        .set('Accept', 'application/json')
      expect(response.res.headers['content-type']).toMatch('application/json')
      expect(response.statusCode).toBe(404)
      expect(response.body).toEqual(fixtures.errors.notFound)

      const storedResources = await Resource.fetchAll()
      expect(storedResources).toEqual(fixtures.resourceList)
    })

    test('Should not update a resouce if the payload is wrong', async () => {
      await addResources()

      const response = await request(app)
        .put(`/api/v1/resources/${fixtures.resourceValidId}`)
        .send(emptyData)
        .set('Accept', 'application/json')
      expect(response.res.headers['content-type']).toMatch('application/json')
      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual(fixtures.resourceList[0])

      const storedResources = await Resource.fetchAll()
      expect(storedResources).toEqual(fixtures.resourceList)
    })
  })

  describe('[DELETE] api/v1/resources/:id', () => {
    test('Should delete the details of a stored resource and returns the deleted resource', async () => {
      await addResources()
      const response = await request(app).delete(`/api/v1/resources/${fixtures.resourceValidId}`)
      expect(response.res.headers['content-type']).toMatch('application/json')
      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual(fixtures.resourceList[0])

      const storedResources = await Resource.fetchAll()
      expect(storedResources).toHaveLength(1)
    })

    test('Should return a 404 error if the resource does not exist', async () => {
      await addResources()
      const response = await request(app).delete(`/api/v1/resources/${fixtures.resourceUselessId}`)
      expect(response.res.headers['content-type']).toMatch('application/json')
      expect(response.statusCode).toBe(404)
      expect(response.body).toEqual(fixtures.errors.notFound)

      const storedResources = await Resource.fetchAll()
      expect(storedResources).toHaveLength(2)
    })
  })
})
