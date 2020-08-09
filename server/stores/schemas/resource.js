const mongoose = require('mongoose')

const resourceSchema = new mongoose.Schema({
  _id: {
    type: String,
    index: true,
    required: true
  },
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
}
)

module.exports = mongoose.model('Resource', resourceSchema)
