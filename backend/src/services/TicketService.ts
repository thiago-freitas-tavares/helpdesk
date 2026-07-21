import { TicketPriority } from '../enums/TicketPriority';
import { TicketStatus } from '../enums/TicketStatus';
import { UserRole } from '../enums/UserRole';
import { AppError } from '../errors/AppError';
import { TicketRepository } from '../repositories/TicketRepository';
import { UserRepository } from '../repositories/UserRepository'; // para buscar o usuário autenticado pelo ID

interface CreateTicketRequest { // interface com os dados que o service espera receber para criar um chamado
  title?: string | undefined;
  description?: string | undefined;
  priority?: TicketPriority | undefined; // padrão é MEDIUM
  requesterId: number; // vem do token JWT, através do request.user.id
}

interface UserSummaryResponse { // interface com os dados que interessam do usuário na resposta
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface TicketResponse { // interface que define como o service vai devolver o chamado criado
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  requester: UserSummaryResponse;
  assignee: UserSummaryResponse | null;
  createdAt: Date;
  updatedAt: Date;
}

export class TicketService {
  private readonly ticketRepository: TicketRepository;
  private readonly userRepository: UserRepository;

  constructor() {
    this.ticketRepository = new TicketRepository();
    this.userRepository = new UserRepository();
  }

  public async create({ title, description, priority, requesterId }: CreateTicketRequest): Promise<TicketResponse> {
    const trimmedTitle = title?.trim();
    const trimmedDescription = description?.trim();

    if (!trimmedTitle) {
      throw new AppError('Título é obrigatório', 400);
    }

    if (!trimmedDescription) {
      throw new AppError('Descrição é obrigatória', 400);
    }

    if (priority && !Object.values(TicketPriority).includes(priority)) {
      throw new AppError('Prioridade inválida', 400);
    }

    const requester = await this.userRepository.findById(requesterId); // requesterId veio do token

    if (!requester) { // usuário pode ter sido excluído do banco depois que o token foi gerado
      throw new AppError('Usuário autenticado não encontrado', 401);
    }

    const ticket = this.ticketRepository.create({
      title: trimmedTitle,
      description: trimmedDescription,
      status: TicketStatus.OPEN,
      priority: priority ?? TicketPriority.MEDIUM,
      requester,
      assignee: null,
    });

    const savedTicket = await this.ticketRepository.save(ticket);

    return this.toTicketResponse(savedTicket);
  }

  public async findById(id: number): Promise<TicketResponse> { // // colocando id: number no parâmetro significa que o método espera receber um valor
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('Chamado inválido', 400);
    }

    const ticket = await this.ticketRepository.findById(id); // não tem problema chamar essa propriedade de ticket, mesmo tendo uma propriedade ticket na função create

    if (!ticket) {
      throw new AppError('Chamado não encontrado', 404);
    }

    return this.toTicketResponse(ticket);
  }

  public async list(): Promise<TicketResponse[]> { // não recebe parâmetro e retorna um array no formato de resposta da API TicketResponse
    const tickets = await this.ticketRepository.findAll();

    return tickets.map((ticket) => this.toTicketResponse(ticket)); // percorre cada ticket da lista tickets e converte o formato (basicamente, tira o createdAt e updratedAt do requester e assignee)
  }

  private toTicketResponse(ticket: { //recebe um objeto ticket e transforma ele no formato TicketResponse
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    requester: {
      id: number;
      name: string;
      email: string;
      role: UserRole;
    };
    assignee: {
      id: number;
      name: string;
      email: string;
      role: UserRole;
    } | null;
    createdAt: Date;
    updatedAt: Date;
  }): TicketResponse {
    return { // objeto que será retornado para o controller.
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      requester: {
        id: ticket.requester.id,
        name: ticket.requester.name,
        email: ticket.requester.email,
        role: ticket.requester.role,
      },
      assignee: ticket.assignee
        ? { // se existir o assignee, monta o objeto
            id: ticket.assignee.id,
            name: ticket.assignee.name,
            email: ticket.assignee.email,
            role: ticket.assignee.role,
          }
        : null, // se não existir, retorna null
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }
}
