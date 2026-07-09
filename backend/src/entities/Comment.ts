import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Ticket } from './Ticket';
import { User } from './User';

@Entity('comments')
export class Comment {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Ticket, {nullable: false, onDelete: 'CASCADE'})
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
