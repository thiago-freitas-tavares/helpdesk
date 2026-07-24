import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../enums/UserRole';

@Entity('users') // a classe abaixo representa uma tabela chamada users
export class User {

  @PrimaryGeneratedColumn()
  id!: number; // TypeScript avisa que a propriedade está undefined, mas colocamos a ! pois o TypeORM vai preencher com dados vindos do banco

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 160, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: false }) // select faz com que o TypeORM não traga a senha nas consultas (respostas da API)
  password!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole;

  @CreateDateColumn({ name:'created_at' }) // quando o nome da propriedade é diferente do nome da coluna no banco
  createdAt!: Date;

  @UpdateDateColumn({ name:'updated_at' })
  updatedAt!: Date;
};
