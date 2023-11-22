import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Order } from '../order/order.entity';
import { Base } from '../base/base.entity';
import { TransactionStatus, TransactionType } from './transaction.enum';

@Entity('transaction')
export class Transaction extends Base {
  @Column('enum', {
    enum: TransactionStatus,
    nullable: false,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column('enum', {
    enum: TransactionType,
    nullable: true,
  })
  type: TransactionType;

  @Column({ nullable: true })
  amount: number;

  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, any>;

  @Column({ nullable: true, unique: false })
  @Index()
  paymentId: string;

  // related to bank order id
  @Column({ nullable: false, unique: false })
  @Index()
  providerOrderId: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @ManyToOne(() => Order, (order) => order.transactions)
  order: Order;
}
