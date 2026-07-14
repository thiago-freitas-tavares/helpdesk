import { Repository } from 'typeorm'; // objeto que sabe fazer operações no banco como find, findOne, create, save, delete, update de registros
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

// vou deixar o acesso ao banco isolado no Repository (somente regra de negócio no Service)
// fluxo: Controller -> Service -> Repository -> TypeORM -> Banco

interface CreateUserData { // interface para tipar os dados necessários para criar usuário
  name: string;
  email: string;
  password: string;
}

export class UserRepository {
  private readonly repository: Repository<User>; // declaração e tipagem da propriedade repository

  constructor() {
    this.repository = AppDataSource.getRepository(User); // atribuição dos dados da entidade User na propriedade repository
  }

  public async findByEmail(email: string): Promise<User | null> { // método que recebe email e retorna User ou null a partir de consulta assíncrona ao banco
    return this.repository.findOne({
      where: {
        email // buscando usuário cujo email é igual ao email recebido como parâmetro do método
      }
    });
  }

  public async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder('user') // consulta controlada para conseguirmos pegar a senha também como retorno e chamo a tabela users de user
      .addSelect('user.password') // incluir a coluna password, além das colunas normais (na entidade User colocamos select: false), para comparar no login
      .where('user.email = :email', { email })
      .getOne(); // executa a query e retorna um único registro ou null
  }

  public create(data: CreateUserData): User { // create não é assíncrono
    return this.repository.create(data); // monta a entidade User com os dados recebidos
  }

  public async save(user: User): Promise<User> {
    return this.repository.save(user); // TypeORM executa o INSERT na tabela users.
  }
}
