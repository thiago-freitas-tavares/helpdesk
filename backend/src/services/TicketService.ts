import { TicketPriority } from '../enums/TicketPriority';
import { TicketStatus } from '../enums/TicketStatus';
import { UserRole } from '../enums/UserRole';
import { AppError } from '../errors/AppError';
import { TicketRepository } from '../repositories/TicketRepository';
import { UserRepository } from '../repositories/UserRepository'; // para buscar o usuário autenticado pelo ID

interface CreateTicketRequest { // interface com o formato dos dados que o service espera receber para criar um chamado
  title?: string | undefined;
  description?: string | undefined;
  priority?: TicketPriority | undefined; // padrão é MEDIUM
  requesterId: number; // vem do token JWT, através do request.user.id
}

interface UserSummaryResponse { // interface com o formato dos dados que interessam do usuário na resposta
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

interface UpdateTicketRequest { // interface com o formato dos dados que o service precisa receber para atualizar um ticket
  id: number;
  authenticatedUserId: number; // representa o id do usuário que está logado no momento
  title?: string | undefined;
  description?: string | undefined;
  status?: TicketStatus | undefined;
  priority?: TicketPriority | undefined;
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
      throw new AppError('Chamado não encontrado', 404); // 404 - Not Found
    }

    return this.toTicketResponse(ticket);
  }

  public async list(): Promise<TicketResponse[]> { // não recebe parâmetro e retorna um array no formato de resposta da API TicketResponse
    const tickets = await this.ticketRepository.findAll();

    return tickets.map((ticket) => this.toTicketResponse(ticket)); // percorre cada ticket da lista tickets e converte o formato (basicamente, tira o createdAt e updratedAt do requester e assignee)
  }

  public async update({ id, authenticatedUserId, title, description, status, priority }: UpdateTicketRequest): Promise<TicketResponse> { // destructuring do objeto recebido
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('Chamado inválido', 400);
    }

    if (title === undefined && description === undefined && status === undefined && priority === undefined) {
      throw new AppError('Informe ao menos um campo para atualização', 400);
    }

    const ticket = await this.ticketRepository.findById(id);

    if (!ticket) {
      throw new AppError('Chamado não encontrado', 404);
    }

    if (ticket.requester.id !== authenticatedUserId) { // verifica se o usuário logado é o mesmo que criou o chamado
      throw new AppError('Você não tem permissão para editar este chamado', 403); // 403 - Forbidden
    }

    if (title !== undefined) { // verifica se o campo title veio no JSON
      const trimmedTitle = title.trim();

      if (!trimmedTitle) { // verifica se o título ficou vazio depois do trim
        throw new AppError('Título é obrigatório', 400);
      }

      ticket.title = trimmedTitle; // atualiza o título do objeto ticket na memória
    }

    if (description !== undefined) {
      const trimmedDescription = description.trim();

      if (!trimmedDescription) {
        throw new AppError('Descrição é obrigatória', 400);
      }

      ticket.description = trimmedDescription;
    }

    if (status !== undefined) {
      if (!Object.values(TicketStatus).includes(status)) {
        throw new AppError('Status inválido', 400);
      }

      ticket.status = status;
    }

    if (priority !== undefined) {
      if (!Object.values(TicketPriority).includes(priority)) {
        throw new AppError('Prioridade inválida', 400);
      }

      ticket.priority = priority;
    }

    const updatedTicket = await this.ticketRepository.save(ticket); // atualiza o objeto ticket no banco, uma vez que já tem id

    return this.toTicketResponse(updatedTicket);
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
