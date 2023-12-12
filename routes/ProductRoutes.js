const express = require("express");
const router = express.Router();

const { getProducts } = require('../controllers/ProductController')

const validate = require("../middleware/handleValidation");

router.get('/get-products', validate, getProducts)

module.exports = router;