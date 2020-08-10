const resourceModel = require('../../stores/schemas/resource')

const resourceValidId = '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const resourceUselessId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
const resourceList = [
  { _id: resourceValidId, url: 'https://dev.to', title: 'Developer Community' },
  { _id: '33e33b3f-48da-4342-98b5-44244b51a2fa', url: 'https://www.freecodecamp.org', title: 'FreeCodeCamp' }
]

module.exports = {
  addResources: () => {
    return resourceModel.collection.insert(resourceList)
  },
  resetDb: () => {
    return resourceModel.collection.remove({})
  },
  fixtures: {
    resourceList,
    resourceValidId,
    resourceUselessId,
    createResourceData: {
      url: 'https://stackoverflow.com/',
      title: 'Stackoverflow community'
    },
    updateResourceData: {
      title: 'new title'
    },
  }
}
