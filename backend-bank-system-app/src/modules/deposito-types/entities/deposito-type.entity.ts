import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';

@Entity('deposito_types')
export class DepositoType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'yearly_return',
  })
  yearlyReturn: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Account, (account) => account.depositoType)
  accounts: Account[];

  // Helper method to calculate monthly return
  getMonthlyReturn(): number {
    return Number(this.yearlyReturn) / 12;
  }
}
