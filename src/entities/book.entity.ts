import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Store } from './store.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'integer', name: 'stock', default: 0 })
  stock: number;

  @ManyToOne(() => Store, (store) => store.books)
  store: Store;
}
