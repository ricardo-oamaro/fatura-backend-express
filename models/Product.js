const mongoose = require('mongoose')

const transactionModel = (modelName) => {
    // Verificar se o modelo já existe
    if (mongoose.models[modelName]) {
        // Se já existe, retornar o modelo existente
        return mongoose.model(modelName);
    }

    // Se não existe, criar e retornar um novo modelo
    const schema = new mongoose.Schema({
        date: String,
        description: String,
        value: Number,
        userId: String
    });

    return mongoose.model(modelName, schema);
};

const Product = mongoose.model('Product', {
    date: String,
    description: String,
    value: Number,
    userId: String
})

module.exports = transactionModel, Product