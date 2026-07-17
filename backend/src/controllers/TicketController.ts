import { NextFunction, Request, Response } from "express";
import { TicketPriority } from "../enums/TicketPriority";
import { TicketService } from "../services/TicketService";
import { AppError } from "../errors/AppError";


interface CreateTicketBody { // body esperado da requisição POST /tickets.
  title?: string | undefined;
  description?: string | undefined;
  priority?: TicketPriority | undefined; 
}

export class TicketController { // contém as rotas relacionadas a chamados
  
  constructor(
    private readonly ticketService: TicketService = new TicketService
  ) {}

  public create = async(
    request: Request<Record<string, never>, unknown, CreateTicketBody>, // tipando o request <parâmetros da rota, corpo da resposta, corpo da requisição>
    response: Response, // objeto de resposta HTTP usado para retornar o chamado criado
    next: NextFunction, // função usada para encaminhar erros ao errorMiddleware
  ): Promise<void> => {
    try {
      if(!request.user) { // o request.user (id e role) vem do token e foi preenchido no authMiddleware
        throw new AppError('Usuário não autenticado', 401);
      }

      const { title, description, priority } = request.body; // title = request.body.title e etc 

      const ticket = await this.ticketService.create({
        title,
        description,
        priority,
        requesterId: request.user.id // consigo acessar request.user aqui, pois criamos o express.d.ts e o authMiddleware antes do Controller na rota o modifica
      });

      response.status(201).json(ticket);
    } catch (error) {
      next(error);
    }
  };
}
