const express = require("express");
const router = express();

router.get('/', (req, res) => {
    res.send('API Working')
})
router.use("/api/users", require("./UserRoutes"));
router.use('/api/product', require('./ProductRoutes'))
router.use('/api/card', require('./CreditCardRoutes'))

module.exports = router;