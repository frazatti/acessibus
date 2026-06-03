import express from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { InteracaoController } from '../controllers/InteracaoController';

const router = express.Router();
const authMiddleware: AuthMiddleware = new AuthMiddleware();
const interacaoController: InteracaoController = new InteracaoController();

router.get('/recents', authMiddleware.validation.bind(authMiddleware), interacaoController.getRecentes.bind(interacaoController));

router.get('/favorites', authMiddleware.validation.bind(authMiddleware), interacaoController.getFavoritos.bind(interacaoController));

router.put('/favorite', authMiddleware.validation.bind(authMiddleware), interacaoController.updateFavorito.bind(interacaoController));

export default router;