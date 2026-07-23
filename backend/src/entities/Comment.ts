import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Ticket } from './Ticket';
import { User } from './User';

@Entity('comments')
export class Comment {

  @PrimaryGeneratedColumn()
  id!: number;

  // onDelete CASCADE significa que quando um ticket for excluído, os comentários vinculados a ele também devem ser excluídos
  @ManyToOne(() => Ticket, {nullable: false, onDelete: 'CASCADE'}) // se onDelete não tivesse sido colocado antes da migration, ela teria que ser feita novamente
  @JoinColumn({ name: 'ticket_id' })
  ticket!: Ticket;

  @ManyToOne(() => User, {nullable: false})
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn({ name:'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name:'updated_at' })
  updatedAt!: Date;
}

/*
Após criar todas as entidades:
npm run build
npm run migration:generate -- src/migrations/CreateInitialTables
npm run migration:run
*/
