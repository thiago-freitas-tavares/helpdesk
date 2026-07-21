import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/authMiddleware';

const authRoutes = Router();

const authController = new AuthController();

authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.get('/me', authMiddleware, authController.me); // antes do controller, a requisição precisa passar pelo middleware de autenticação, ele valida o token e preenche request.user

export { authRoutes }; // exporta as rotas para serem usadas no index.ts
