import express from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { InteracaoController } from '../controllers/InteracaoController';

const router = express.Router();
const authMiddleware: AuthMiddleware = new AuthMiddleware();
const interacaoController: InteracaoController = new InteracaoController();

router.get('/recents', authMiddleware.validation, interacaoController.getRecentes);

router.get('/favorites', authMiddleware.validation, interacaoController.getFavoritos);

router.post('/favorite', authMiddleware.validation, interacaoController.updateFavorito);

export default router;