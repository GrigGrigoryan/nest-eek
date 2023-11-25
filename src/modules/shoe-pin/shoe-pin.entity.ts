import { Base } from '../base/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CartItem } from '../cart-item/cart-item.entity';
import { Category } from '../category/category.entity';
import { Image } from '../image/image.entity';

@Entity('shoe_pin')
export class ShoePin extends Base {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: string;

  @OneToMany(() => Image, (image) => image.shoePin)
  images: Image[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.shoePin)
  cartItems: CartItem[];

  @ManyToOne(() => Category, (category) => category.shoePins)
  category: Category[];
}
