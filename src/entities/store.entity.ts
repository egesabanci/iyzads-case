import { Book } from './book.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'string', name: 'name' })
  name: string;

  @OneToMany(() => Book, (book) => book.store)
  books: Book[];
}
