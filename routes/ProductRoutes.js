const express = require("express");
const router = express.Router();
const getUserId = require("../middleware/getUserId")

const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/ProductController')

const validate = require("../middleware/handleValidation");

router.get('/get-products', getUserId, validate, getProducts)
router.post('/create', getUserId, validate, createProduct)
router.put('/update/:id', getUserId, validate, updateProduct)
router.delete('/delete/:id', validate, deleteProduct)

module.exports = router;