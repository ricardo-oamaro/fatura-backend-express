const Product = require('../models/Product')

const getProducts = async (req, res) => {
    const { userId } = req.body;

    const product = await Product.find({ userId })

    if (!product){
        res.status(404).json({ errors: ["Nenhum produto encontrado"]})
        return;
    }

    res.status(200).json({ 
        date: product.date,
        description: product.description,
        value: product.value

    })
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

module.exports = {
    getProducts,
    createProduct
}