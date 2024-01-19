const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: String,
    // Outras propriedades do item, se necessário
});

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema],
    userId: String,
});

const List = mongoose.model('List', listSchema);

module.exports = List;