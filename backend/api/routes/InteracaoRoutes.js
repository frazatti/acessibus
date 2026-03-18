const express = require('express');
const interacaoController = require('../controllers/InteracaoController')
const authMiddleware = require('../middlewares/AuthMiddleware')
const router = express.Router();

router.get('/recents', authMiddleware.validation, interacaoController.getRecentes);

router.get('/favorites', authMiddleware.validation, interacaoController.getFavoritos);

router.post('/favorite', authMiddleware.validation, interacaoController.toggleFavorito);

module.exports = router;