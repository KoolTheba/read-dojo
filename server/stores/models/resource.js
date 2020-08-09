const debug = require('debug')('read-dojo:model:resource')
const resourceModel = require('../schemas/resource')
const { v4: uuidv4 } = require('uuid')

module.exports = {
  create: (data) => {
    debug('Creating resource with data %o', data)
    return resourceModel.create({ _id: uuidv4(), ...data })
  },
  fetchAll: () => {
    debug('Fetching all resouces')
    return resourceModel.find({}).lean()
  },
  fetchOne: (id) => {
    debug('Fetching resource with id %o', id)
    return resourceModel.findById(id).lean()
  },
  update: (id, data) => {
    debug('Updating resource with id %o and %o', id, data)
    return resourceModel.findByIdAndUpdate(id, data, {
      new: true
    }).lean()
  },
  delete: (id) => {
    debug('Deleting resource with id %o', id)
    return resourceModel.findByIdAndRemove(id).lean()
  }
}
