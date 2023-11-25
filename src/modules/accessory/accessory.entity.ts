import { Base } from '../base/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CartItem } from '../cart-item/cart-item.entity';
import { Category } from '../category/category.entity';
import { Image } from '../image/image.entity';

@Entity('accessory')
export class Accessory extends Base {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: string;

  @OneToMany(() => Image, (image) => image.accessory)
  images: Image[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.accessory)
  cartItems: CartItem[];

  @ManyToOne(() => Category, (category) => category.accessories)
  category: Category[];
}
