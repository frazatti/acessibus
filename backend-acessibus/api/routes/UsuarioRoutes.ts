import express from 'express';
import { UserController } from '../controllers/UsuarioController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = express.Router();
const userController: UserController = new UserController();
const authMiddleware: AuthMiddleware = new AuthMiddleware();

router.post('/user', userController.create.bind(userController));
router.post('/auth/login', userController.login.bind(userController));
router.put('/user', authMiddleware.validation.bind(authMiddleware), userController.update.bind(userController));
router.get('/user', authMiddleware.validation.bind(authMiddleware), userController.getProfile.bind(userController));

export default router;