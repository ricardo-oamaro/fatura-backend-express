const express = require("express");
const router = express.Router();
const getUserId = require("../middleware/getUserId")

const { 
    createList,
    getListsByUserId
 } = require('../controllers/CreditCardController')

router.post('/lists', getUserId, createList)
router.get('/get-lists', getUserId, getListsByUserId)

module.exports = router;