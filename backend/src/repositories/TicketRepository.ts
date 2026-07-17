import { Repository,  } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Ticket } from '../entities/Ticket';
import { User } from '../entities/User';

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
    return this.repository.save(ticket); // TypeORM executa o INSERT na tabela tickets e retorna o chamado salvo, já com id, createdAt e updatedAt.
  }
}
