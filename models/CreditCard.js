const mongoose = require('mongoose');

const collectionModel = (modelName) => {
    if (mongoose.models[modelName]) {
        return mongoose.model(modelName);
    }
    const schema = new mongoose.Schema({})
    return mongoose.model(modelName, schema);
};

module.exports = collectionModel