import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';
import { authMiddleware } from '../middlewares/authMiddleware';

const ticketRoutes = Router();

const ticketController = new TicketController();

ticketRoutes.post('/', authMiddleware, ticketController.create); // no index.ts será colocada a rota /tickets, dessa forma, essa rota também fica /tickets
ticketRoutes.get('/', authMiddleware, ticketController.list); // get busca dados - caminho final /tickets - essa rota aceita query params, como GET /tickets?status=OPEN&priority=HIGH&createdAtOrder=DESC
ticketRoutes.get('/:id', authMiddleware, ticketController.findById); // usamos id no ticketController e essa rota diz respeito somente a ticket
ticketRoutes.patch('/:id', authMiddleware, ticketController.update); // patch representa alteração parcial (alguns campos), enquanto que put seria alteração total (todos os campos)
ticketRoutes.delete('/:id', authMiddleware, ticketController.delete); // rota final /tickets/:id

export { ticketRoutes };
