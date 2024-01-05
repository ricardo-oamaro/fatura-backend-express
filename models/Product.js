const mongoose = require('mongoose')

const Product = mongoose.model('Product', {
    date: String,
    description: String,
    value: Number,
    userId: String
})

module.exports = Product