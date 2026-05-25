import express from 'express';
import { OptionalAuthMiddleware } from '../middlewares/OptionalAuthMiddleware';
import { LinhaController } from '../controllers/LinhaController';

const router = express.Router();
const optionalAuthMiddleware: OptionalAuthMiddleware = new OptionalAuthMiddleware();
const linhaController: LinhaController = new LinhaController();

router.post('/linha/search', optionalAuthMiddleware.validation.bind(optionalAuthMiddleware), linhaController.getLinhasByTermo.bind(linhaController));
router.post('/linha', linhaController.create.bind(linhaController));

export default router;