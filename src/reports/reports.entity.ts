import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn() // marks a column as the table's primary key and tells TypeORM to auto-generate its value
  id!: number;

  @Column()
  price!: number;
}
