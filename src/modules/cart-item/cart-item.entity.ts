import { Base } from '../base/base.entity';
import { shoes } from '../shoes/shoes.entity';
import { Cart } from '../cart/cart.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Accessory } from '../accessory/accessory.entity';

@Entity('cart_item')
export class CartItem extends Base {
  @Column()
  quantity: number;

  @ManyToOne(() => shoes, (shoes) => shoes.cartItems)
  shoes: shoes;

  @ManyToOne(() => Accessory, (accessory) => accessory.cartItems)
  accessory: Accessory;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;
}
