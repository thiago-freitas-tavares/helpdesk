import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Comment } from '../entities/Comment';

type CreateCommentData = Pick<Comment, 'ticket' | 'author' | 'content'>; // em Comment.ts as colunas ticket_id e author_id foram definidas como ticket e author no TypeScript 

export class CommentRepository { // operações de banco relacionadas a comentários

  private readonly repository: Repository<Comment>;

  constructor() {
    this.repository = AppDataSource.getRepository(Comment); // a partir disso, conseguimos usar métodos como create, save, find, findOne, delete
  };

  public create(data: CreateCommentData): Comment {
    return this.repository.create(data);
  };

  public async save(comment: Comment): Promise<Comment> {
    return this.repository.save(comment); // TypeORM executa o INSERT na tabela comments e retorna o comentário salvo, já com id, createdAt e updatedAt
  };

  public async findByTicketId(ticketId: number): Promise<Comment[]> { // recebe id do ticket como parâmetro e retorna um array da entidade do banco Comment
    return this.repository.find({
      where: {
        ticket: {
          id: ticketId,
        },
      },
      relations: {
        ticket: true, // ticket_id está como ticket na entidade Comment.ts
        author: true, // author_id está como author na entidade Comment.ts
      },
      order: {
        createdAt: 'ASC',
      },
    });
  };

  public async findById(id: number): Promise<Comment | null> { // busca pelo id do comentário
    return this.repository.findOne({
      where: {
        id,
      },
      relations: {
        ticket: true, // esse é o id do ticket - no service vamos validar se o comentário pertence ao chamado informado na URL
        author: true, // esse é o id do author - no service vamos validar se o usuário logado é o autor do comentário
      },
    });
  };

  public async remove(comment: Comment): Promise<void> {
    await this.repository.remove(comment);
  };
};
