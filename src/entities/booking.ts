
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Event } from './event';

@Entity()
@Index(['event_id', 'user_id'], { unique: true })
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  event_id!: number;

  @Column()
  user_id!: string;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Event, event => event.bookings)
  event!: Event;
}