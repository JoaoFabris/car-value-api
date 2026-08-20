import { Report } from 'src/reports/reports.entity';
import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() //marks a column as the table's primary key and tells TypeORM to auto-generate its value
  id!: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ default: true })
  admin!: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports!: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Insert User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Remove user with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Update User with id', this.id);
  }
}
