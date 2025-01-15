import { Book } from './book.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'varchar', name: 'name', unique: true })
  name: string;

  @OneToMany(() => Book, (book) => book.store)
  books: Book[];
}
