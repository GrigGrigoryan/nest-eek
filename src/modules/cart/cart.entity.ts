import { Base } from '../base/base.entity';
import { User } from '../user/entities/user.entity';
import { CartItem } from '../cart-item/cart-item.entity';
import { Entity, OneToMany, OneToOne } from 'typeorm';
import { Order } from '../order/order.entity';

@Entity('cart')
export class Cart extends Base {
  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];

  @OneToOne(() => User, (user) => user.cart)
  user: User;

  @OneToMany(() => Order, (order) => order.cart)
  orders: Order[];
}
