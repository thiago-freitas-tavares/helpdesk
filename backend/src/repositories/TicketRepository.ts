import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Ticket } from '../entities/Ticket';

// eu poderia fazer uma interface igual à do CreateUserData no UserRepository.ts, mas fiz com type/Pick, aproveitando a tipagem do Ticket.ts
type CreateTicketData = Pick< // type para tipar os dados necessários para criar chamado
  Ticket,
  'title' | 'description' | 'status' | 'priority' | 'requester' | 'assignee'
>;

export class TicketRepository {

  constructor(
    private readonly repository: Repository<Ticket> = AppDataSource.getRepository(Ticket)
  ) {}

  
  public create(data: CreateTicketData): Ticket {
    return this.repository.create(data);
  }
  
  public async save(ticket: Ticket): Promise<Ticket> {
    return this.repository.save(ticket); // TypeORM executa o INSERT na tabela tickets e retorna o chamado salvo, já com id, createdAt e updatedAt
  }
  public async findById(id: number): Promise<Ticket | null> { // para confirmar se o chamado existe antes de adicionar um comentário
    return this.repository.findOne({
      where: {
        id,
      },
      relations: { // incluir no retorno quando buscamos um chamado específico
        requester: true,
        assignee: true,
      }
    });
  }

  public async findAll(): Promise<Ticket[]> { // não recebe parâmetro e retorna um array da entidade do banco Ticket
    return this.repository.find({
      relations: { // relações que queremos carregar junto com o chamado, por padrão o TypeORM pode não trazer automaticamente
        requester: true,
        assignee: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
