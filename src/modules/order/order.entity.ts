import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Transaction } from '../transaction/transaction.entity';
import { Base } from '../base/base.entity';
import { OrderStatus } from './order.enum';
import { Cart } from '../cart/cart.entity';

@Entity('order')
export class Order extends Base {
  @Column('enum', {
    enum: OrderStatus,
    nullable: false,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ nullable: false })
  price: number;

  @ManyToOne(() => Cart, (cart) => cart.orders)
  cart: Cart;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.order)
  transactions: Transaction[];
}
