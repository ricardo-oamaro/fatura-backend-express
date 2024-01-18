const express = require("express");
const router = express.Router();
const getUserId = require("../middleware/getUserId")

const { createCreditCard } = require('../controllers/CreditCardController')

router.post('/create/:modelName', getUserId, createCreditCard)

module.exports = router;