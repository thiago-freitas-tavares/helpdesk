import { FindOptionsWhere, Repository } from 'typeorm';
import { TicketPriority } from '../enums/TicketPriority';
import { TicketStatus } from '../enums/TicketStatus';
import { AppDataSource } from '../data-source';
import { Ticket } from '../entities/Ticket';

// eu poderia fazer uma interface igual à do CreateUserData no UserRepository.ts, mas fiz com type/Pick, aproveitando a tipagem do Ticket.ts
type CreateTicketData = Pick< // type para tipar os dados necessários para criar chamado
  Ticket,
  'title' | 'description' | 'status' | 'priority' | 'requester' | 'assignee'
>;

type CreatedAtOrder = 'ASC' | 'DESC';

interface FindAllTicketsFilters { // interface dos filtros que o repository recebe validados e formatados do service
  status?: TicketStatus | undefined;
  priority?: TicketPriority | undefined;
  createdAtOrder: CreatedAtOrder; // service sempre vai definir um padrão
}

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

  public async findAll({ status, priority, createdAtOrder }: FindAllTicketsFilters): Promise<Ticket[]> { // recebe filtros como parâmetro e retorna um array da entidade do banco Ticket (lista de tickets)
    const where: FindOptionsWhere<Ticket> = {}; // objeto de filtros inicialmente vazio, se nenhum filtro for enviado, busca todos os chamados

    if (status !== undefined) { // se status for enviado -> GET /tickets?status=OPEN
      where.status = status;
    }

    if (priority !== undefined) { // se prioridade for enviada -> GET /tickets?priority=HIGH
      where.priority = priority;
    }

    return this.repository.find({
      where, // aplica os filtros montados (status, priority ou os dois)
      relations: { // relações que queremos carregar junto com o chamado, por padrão o TypeORM pode não trazer automaticamente
        requester: true,
        assignee: true,
      },
      order: {
        createdAt: createdAtOrder,
      },
    });
  }

  public async remove(ticket: Ticket): Promise<void> {
    await this.repository.remove(ticket);
  }
}
