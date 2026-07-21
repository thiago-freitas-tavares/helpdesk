import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';
import { authMiddleware } from '../middlewares/authMiddleware';

const ticketRoutes = Router();

const ticketController = new TicketController();

ticketRoutes.post('/', authMiddleware, ticketController.create); // no index.ts será colocada a rota /tickets, dessa forma, essa rota também fica /tickets
ticketRoutes.get('/', authMiddleware, ticketController.list); // get busca dados - caminho final /tickets

export { ticketRoutes };
