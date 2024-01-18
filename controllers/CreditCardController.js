const collectionModel = require('../models/CreditCard')

const createCreditCard = async (req, res) => {
    const { modelName } = req.params;

    try {
        const NewCollection = collectionModel(modelName);
        const collection = new NewCollection();
        await collection.save();
        res.status(201).json({ msg: 'Cartão criado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao criar cartão, tente novamente' });
    }
};

module.exports = { createCreditCard };