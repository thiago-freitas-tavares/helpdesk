import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TicketPriority } from '../enums/TicketPriority';
import { TicketStatus } from '../enums/TicketStatus';
import { User } from './User';

@Entity('tickets')
export class Ticket {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 160 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN })
  status!: TicketStatus;

  @Column({ type: 'enum', enum: TicketPriority, default: TicketPriority.MEDIUM })
  priority!: TicketPriority;

  // primeiro parâmetro usa uma callback function que retorna User - function() { return User } - ao invés de User direto, para evitar problemas de ordem de importação e dependência circular
  @ManyToOne(() => User, {nullable: false})
  @JoinColumn({ name: 'requester_id' }) // o nome da coluna no banco é requester_id
  requester!: User; // mas o nome da propriedade na entidade é requester, do tipo User, que me da acesso às propriedades de User.

  @ManyToOne(() => User, {nullable: true})
  @JoinColumn({ name: 'assignee_id' })
  assignee!: User | null;

  @CreateDateColumn({ name:'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name:'updated_at' })
  updatedAt!: Date;
}
