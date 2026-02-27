const express = require('express');
const linhaController = require('../controllers/LinhaController');
const optionalAuthMiddleware = require('../middlewares/OptionalAuthMiddleware')
const router = express.Router();

router.post('/linha/search', optionalAuthMiddleware.validation, linhaController.search);
router.post('/linha', linhaController.register);

module.exports = router;