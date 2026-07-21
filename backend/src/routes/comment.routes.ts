import { Router } from 'express';
import { CommentController } from '../controllers/CommentControler';
import { authMiddleware } from '../middlewares/authMiddleware';

const commentRoutes = Router();

const commentController = new CommentController();

commentRoutes.post('/tickets/:ticketId/comments', authMiddleware, commentController.create); // usamos ticketId no commentController e essa rota diz respeito a ticket e comment
// :ticketId é variável e em cada caso, o Express coloca seu valor dentro de request.params.ticketId - usamos :ticketId ao invés de somente id para não ter confusão

export { commentRoutes };
