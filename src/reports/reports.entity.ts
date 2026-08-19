import { User } from 'src/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn() // marks a column as the table's primary key and tells TypeORM to auto-generate its value
  id!: number;

  @Column()
  price!: number;

  @Column()
  make!: string;

  @Column()
  model!: string;

  @Column()
  year!: number;

  @Column()
  lng!: number;

  @Column()
  lat!: number;

  @Column()
  mileage!: number;

  @ManyToOne(() => User, (user) => user.reports)
  user!: User;
}
