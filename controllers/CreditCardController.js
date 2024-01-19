const List = require('../models/CreditCard')

const createList = async (req, res) => {
    const { name, items } = req.body;

    try {
        const newList = await List.create({ name, items, userId: userId });
        return res.status(201).json(newList);
    } catch (error) {
        console.error('Erro ao criar lista:', error);
        return res.status(500).json({ message: 'Erro ao criar lista, tente novamente.' });
    }
};

const getListsByUserId = async (req, res) => {

    try {
        const userLists = await List.find({ userId });
        return res.status(200).json(userLists);
    } catch (error) {
        console.error('Erro ao buscar listas do usuário:', error);
        return res.status(500).json({ message: 'Erro ao buscar listas do usuário, tente novamente.' });
    }
};

module.exports = { createList, getListsByUserId };