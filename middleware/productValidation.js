const { body } = require("express-validator");

const productCreateValidation = () => {
    body('date')
        .isString()
        .withMessage('Insira a data da compra'),
    body('description')
        .isString()
        .withMessage('A descrição não pode ser vazia')
        .isLength({ min: 3 })
        .withMessage("A descrição precisa ter no mínimo 3 caracteres."),
    body('value')
        .isString()
        .withMessage('O valor da compra é obrigatorio')
}

module.exports = {
    productCreateValidation
}