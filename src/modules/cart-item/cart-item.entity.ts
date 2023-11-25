import { Base } from '../base/base.entity';
import { Shoe } from '../shoe/shoe.entity';
import { Cart } from '../cart/cart.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ShoePin } from '../shoe-pin/shoe-pin.entity';

@Entity('cart_item')
export class CartItem extends Base {
  @Column()
  quantity: number;

  @ManyToOne(() => Shoe, (shoe) => shoe.cartItems)
  shoe: Shoe;

  @ManyToOne(() => ShoePin, (shoePin) => shoePin.cartItems)
  shoePin: ShoePin;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;
}
