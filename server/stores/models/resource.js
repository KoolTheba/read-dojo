const mongoose = require('mongoose')

const resourceSchema = new mongoose.Schema({
  url: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    unique: false,
    required: true
  }
})

const resourceModel = mongoose.model('Resource', resourceSchema)

module.exports = resourceModel
