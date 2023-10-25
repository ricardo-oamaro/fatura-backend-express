const mongoose = require('mongoose')

const User = mongoose.model('User', {
  name: String,
  email: String,
  passwd: String
})

module.exports = User