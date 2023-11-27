import { Base } from '../base/base.entity';
import { Shoes } from '../shoes/shoes.entity';
import { Cart } from '../cart/cart.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Accessory } from '../accessory/accessory.entity';

@Entity('cart_item')
export class CartItem extends Base {
  @Column()
  quantity: number;

  @ManyToOne(() => Shoes, (shoes) => shoes.cartItems)
  shoes: Shoes;

  @ManyToOne(() => Accessory, (accessory) => accessory.cartItems)
  accessory: Accessory;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;
}
