import { Router } from 'express';
import { CommentController } from '../controllers/CommentControler';
import { authMiddleware } from '../middlewares/authMiddleware';

const commentRoutes = Router();

const commentController = new CommentController();

commentRoutes.post('/tickets/:ticketId/comments', authMiddleware, commentController.create);
// :ticketId é variável e em cada caso, o Express coloca seu valor dentro de request.params.ticketId

export { commentRoutes };
