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

module.exports = {
    getProducts
}