const transactionModel = require('../models/Product')
const Product = require('../models/Product')

const getTransactions = async (req, res) => {
    try {
        const products = await Product.find({ userId: userId })
        const soma = products.reduce((acc, product) => acc + product.value, 0);

        if (!products){
            res.status(404).json({ errors: ["Nenhum produto encontrado"]})
            return;
            
        }
        res.status(200).json({products, soma})
    } catch (error) {
        console.log(error);
    }

}

const createProduct = async (req, res) => {
    const { date, description, value } = req.body;

    const newProduct = new Product({
        date,
        description,
        value,
        userId: userId,
    })

    try {
        await newProduct.save()
        res.status(201).json({ msg: 'Produto criado com sucesso!' })

    } catch (error) {
        log.magenta(error)
        res.status(500).json({ msg: 'Erro ao criar objeto, tente novamente' })
    }
}

const createTransaction = async (req, res) => {
    const { modelName } = req.params;
    const { date, description, value } = req.body;

    try {
        const Model = transactionModel(modelName);
        const transaction = new Model({ 
            date, 
            description, 
            value,
            userId: userId,
         })
        await transaction.save();
        res.status(201).json({ msg: 'Produto criado com sucesso!' })

    } catch (error) {
        log.magenta(error)
        res.status(500).json({ msg: 'Erro ao criar objeto, tente novamente' })
    }
}

const updateTransaction = async (req, res) => {
    const { _id, date, description, value } = req.body

    try {
        // Encontra o registro pelo ID e atualiza no banco de dados
        const produtoAtualizado = await Product.findByIdAndUpdate(_id, { date: date, description: description, value: value }, { new: true });

        res.status(201).json(produtoAtualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteTransaction = async (req, res) => {
    try {
        const id = req.params.id
        console.log('O ID é ' + id);
        
        const produtoExcluido = await Product.findByIdAndDelete(id);

        if (!produtoExcluido) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        res.json({ message: 'Produto excluído com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getTransactions,
    createProduct,
    createTransaction,
    updateTransaction,
    deleteTransaction
}