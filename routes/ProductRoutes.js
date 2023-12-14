const express = require("express");
const router = express.Router();
const getUserId = require("../middleware/getUserId")

const { getProducts, createProduct } = require('../controllers/ProductController')

const validate = require("../middleware/handleValidation");

router.get('/get-products', validate, getProducts)
router.post('/create', getUserId, validate, createProduct)

module.exports = router;