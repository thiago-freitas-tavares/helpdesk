import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';
import { authMiddleware } from '../middlewares/authMiddleware';

const ticketRoutes = Router();

const ticketController = new TicketController();

ticketRoutes.post('/', authMiddleware, ticketController.create); // no index.ts será colocada a rota /ticket, dessa forma, essa rota também fica /ticket

export { ticketRoutes };
