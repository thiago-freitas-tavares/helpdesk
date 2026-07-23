import { NextFunction, Request, Response } from "express";
import { TicketService } from "../services/TicketService";
import { AppError } from "../errors/AppError";
import { TicketPriority } from "../enums/TicketPriority";
import { TicketStatus } from "../enums/TicketStatus";
import { authMiddleware } from "../middlewares/authMiddleware";

interface TicketIdParams { // FindTicketParams, UpdateTicketParams e DeleteTicketParams possuem exatamente a mesma estrutura, por isso, criamos uma mais genérica para usar em todas
  id?: string | undefined; // GET /tickets/1 chega como request.params.id = '1'
}

interface CreateTicketBody { // body esperado da requisição POST /tickets.
  title?: string | undefined;
  description?: string | undefined;
  priority?: TicketPriority | undefined; 
}

interface UpdateTicketBody {
  title?: string | undefined;
  description?: string | undefined;
  status?: TicketStatus | undefined;
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

  public findById = async (
    request: Request<TicketIdParams>,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = request.params; // extrai o id da URL - GET /tickets/1 -> id = '1'

      const ticket = await this.ticketService.findById(Number(id));

      response.status(200).json(ticket);
    } catch (error) {
      next(error);
    }
  };

  public list = async (
    _request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tickets = await this.ticketService.list();

      response.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  };

  public update = async (
    request: Request<TicketIdParams, unknown, UpdateTicketBody>, // id = parâmetro - title, description, status, priority = body
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!request.user) { // o TypesScript reclama que 'authenticatedUserId: request.user.id' pode ser undefined se eu não fizer essa validação aqui
        throw new AppError('Usuário não autenticado', 401);
      }

      const { id } = request.params;
      const { title, description, status, priority } = request.body;

      const ticket = await this.ticketService.update({
        id: Number(id),
        authenticatedUserId: request.user.id,
        title,
        description,
        status,
        priority,
      });

      response.status(200).json(ticket);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (
    request: Request<TicketIdParams>,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!request.user) {
        throw new AppError('Usuário não autenticado', 401);
      }

      const { id } = request.params;

      const ticket = await this.ticketService.delete({
        id: Number(id),
        authenticatedUserId: request.user.id,
      });

      response.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
