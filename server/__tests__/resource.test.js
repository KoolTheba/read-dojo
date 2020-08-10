require('dotenv').config()
const dbName = process.env.DB_NAME
const dbUrl = process.env.DB_URL
const { Resource, dbInit } = require('../stores')
const { addResources, resetDb, fixtures } = require('./helpers')

const emptyData = {}

beforeAll(() => dbInit(dbUrl, dbName))
beforeEach(resetDb)
afterAll(resetDb)

describe('STORE: resource model', () => {
  describe('create', () => {
    test('Should store a new resource', async () => {
      const resourceData = fixtures.createResourceData
      const createdResource = await Resource.create(resourceData)
      expect(createdResource.url).toEqual(resourceData.url)
      expect(createdResource.title).toEqual(resourceData.title)

      const storedResources = await Resource.fetchAll()

      expect(storedResources).toHaveLength(1)
      expect(storedResources[0].url).toEqual(resourceData.url)
      expect(storedResources[0].title).toEqual(resourceData.title)
    })

    test('Should not store a new resource if data is wrong', async () => {
      try {
        await Resource.create(emptyData)
      } catch (e) {
        expect(e.message).toMatch('Resource validation failed')
      }

      const storedResources = await Resource.fetchAll()
      expect(storedResources).toHaveLength(0)
    })
  })

  describe('fetchAll', () => {
    test('Should fetch all the resources', async () => {
      await addResources()
      const storedResources = await Resource.fetchAll()
      expect(storedResources).toEqual(fixtures.resourceList)
    })

    test('Should return an empty array if there are no resources', async () => {
      const storedResources = await Resource.fetchAll()
      expect(storedResources).toEqual([])
    })
  })

  describe('fetchOne', () => {
    test('Should fetch one of the resources', async () => {
      await addResources()
      const storedResource = await Resource.fetchOne(fixtures.resourceValidId)
      expect(storedResource).toEqual(fixtures.resourceList[0])
    })

    test('Should not fetch one of the resources if the id is wrong', async () => {
      const storedResource = await Resource.fetchOne(fixtures.resourceUselessId)
      expect(storedResource).toEqual(null)
    })
  })

  describe('update', () => {
    test('Should update an specific resource if the data is correct', async () => {
      await addResources()
      const updatedResource = await Resource.update(
        fixtures.resourceValidId,
        fixtures.updateResourceData
      )
      expect(updatedResource.title).toEqual('new title')

      const storedResource = await Resource.fetchOne(fixtures.resourceValidId)
      expect(storedResource.title).toEqual('new title')
    })

    test('Should not update an specific resource if the id is wrong', async () => {
      await addResources()
      const updatedResource = await Resource.update(
        fixtures.resourceUselessId,
        fixtures.updateResourceData
      )
      expect(updatedResource).toEqual(null)

      const storedResources = await Resource.fetchAll()
      expect(storedResources).toEqual(fixtures.resourceList)
    })

    test('Should not update an specific resource if the data is wrong', async () => {
      await addResources()

      const updatedResource = await Resource.update(
        fixtures.resourceValidId,
        emptyData
      )
      expect(updatedResource).toEqual(fixtures.resourceList[0])

      const storedResources = await Resource.fetchAll()
      expect(storedResources).toEqual(fixtures.resourceList)
    })
  })

  describe('delete', () => {
    test('Should delete an specific resource', async () => {
      await addResources()
      const deletedResource = await Resource.delete(fixtures.resourceValidId)
      expect(deletedResource).not.toEqual(null)

      const storedResources = await Resource.fetchAll()
      expect(storedResources).toHaveLength(1)
    })

    test('Should not delete an specific resource if the id is wrong', async () => {
      await addResources()
      const deletedResource = await Resource.delete(fixtures.resourceUselessId)
      expect(deletedResource).toEqual(null)

      const storedResources = await Resource.fetchAll()
      expect(storedResources).toHaveLength(2)
    })
  })
})
