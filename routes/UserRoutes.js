const express = require("express");
const router = express.Router();

// Controller
const { register, login, getCurrentUser } = require('../controllers/UserController')

//Middlewares
const validate = require("../middleware/handleValidation");
const { userCreateValidation, loginValidation } = require("../middleware/userValidations");
const getUserId = require("../middleware/getUserId");


// Routes
router.post("/register", userCreateValidation(), validate, register);
router.post('/login', loginValidation(), validate, login)
router.get('/get-current-user/:_id', getUserId, validate, getCurrentUser)

module.exports = router;