import { UserRole } from '../enums/UserRole';
import { AppError } from '../errors/AppError';
import { CommentRepository } from '../repositories/CommentRepository';
import { TicketRepository } from '../repositories/TicketRepository';
import { UserRepository } from '../repositories/UserRepository';

interface ListCommentsByTicketRequest { // interface com o formato dos dados que o service precisa receber para listar comentários de um chamado
  ticketId: number;
}

interface CreateCommentRequest { // interface com o formato dos dados que o service espera receber para criar um comentário
  content?: string | undefined; // pode vir inválido, depois vamos validar
  ticketId: number; // vem da URL /tickets/:ticketId/comments
  authorId: number; // vem do token JWT, através do request.user.id
}

interface UserSummaryResponse { // interface com o formato dos dados que interessam do usuário na resposta
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface TicketSummaryResponse { // interface com o formato dos dados que interessam do ticket na resposta
  id: number;
  title: string;
}

interface CommentResponse { // interface que define como o service vai devolver o comentário criado
  id: number;
  content: string;
  ticket: TicketSummaryResponse;
  author: UserSummaryResponse;
  createdAt: Date;
  updatedAt: Date;
}

export class CommentService {
  
  constructor(
    private readonly commentRepository: CommentRepository = new CommentRepository(),
    private readonly ticketRepository: TicketRepository = new TicketRepository(),
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  public async create({ content, ticketId, authorId }: CreateCommentRequest): Promise<CommentResponse> {
    
    if(!Number.isInteger(ticketId) || ticketId <= 0) { // validar, pois o ticketId vem da URL como string e será convertido para número no controller
      throw new AppError('Chamado inválido', 400);
    }
    
    const trimmedContent = content?.trim();

    if(!trimmedContent) {
      throw new AppError('Mensagem é obrigatória', 400);
    }

    const ticket = await this.ticketRepository.findById(ticketId);

    if(!ticket) {
      throw new AppError('Chamado não encontrado', 404);
    }

    const author = await this.userRepository.findById(authorId);

    if(!author) {
      throw new AppError('Usuário autenticado não encontrado', 401);
    }

    const comment = this.commentRepository.create({
      content: trimmedContent,
      ticket,
      author,
    });

    const savedComment = await this.commentRepository.save(comment);

    return this.toCommentResponse(savedComment); // formata o comentário salvo para o formato de resposta da API
  }

  public async listByTicketId({ ticketId }: ListCommentsByTicketRequest): Promise<CommentResponse[]> { // colocando apenas ticketId no parâmetro significa que o método espera receber um objeto
  if (!Number.isInteger(ticketId) || ticketId <= 0) {
    throw new AppError('Chamado inválido', 400);
  }

  const ticket = await this.ticketRepository.findById(ticketId); // somente para validar

  if (!ticket) {
    throw new AppError('Chamado não encontrado', 404);
  }

  const comments = await this.commentRepository.findByTicketId(ticketId);

  return comments.map((comment) => this.toCommentResponse(comment)); // formata os comentários
}

  private toCommentResponse(comment: {
    id: number;
    content: string;
    ticket: {
      id: number;
      title: string;
    };
    author: {
      id: number;
      name: string;
      email: string;
      role: UserRole;
    };
    createdAt: Date;
    updatedAt: Date;
  }): CommentResponse {
    return {
      id: comment.id,
      content: comment.content,
      ticket: {
        id: comment.ticket.id,
        title: comment.ticket.title,
      },
      author: {
        id: comment.author.id,
        name: comment.author.name,
        email: comment.author.email,
        role: comment.author.role,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
