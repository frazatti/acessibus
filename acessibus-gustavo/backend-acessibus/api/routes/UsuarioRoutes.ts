import express from 'express';
import { UserController } from '../controllers/UsuarioController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = express.Router();
const userController: UserController = new UserController();
const authMiddleware: AuthMiddleware = new AuthMiddleware();

router.post('/user', userController.create);
router.post('/auth/login', userController.login);
router.put('/user', authMiddleware.validation, userController.update);
router.get('/user', authMiddleware.validation, userController.getProfile);

export default router;