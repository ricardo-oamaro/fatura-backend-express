const express = require("express");
const router = express.Router();
const getUserId = require("../middleware/getUserId")

const { getTransactions, createTransaction, updateTransaction, deleteTransaction } = require('../controllers/ProductController')

const validate = require("../middleware/handleValidation");

router.get('/get-products', getUserId, validate, getTransactions)
router.post('/create-transaction/:modelName', getUserId, validate, createTransaction)
router.put('/update/:id', getUserId, validate, updateTransaction)
router.delete('/delete/:id', validate, deleteTransaction)

module.exports = router;