import { Base } from '../base/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CartItem } from '../cart-item/cart-item.entity';
import { Category } from '../category/category.entity';
import { Image } from '../image/image.entity';

@Entity('shoe')
export class Shoe extends Base {
  @Column()
  size: string;

  @Column()
  color: string;

  @Column()
  material: string;

  @Column()
  gender: string;

  @Column()
  season: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: string;

  @OneToMany(() => Image, (image) => image.shoe)
  images: Image[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.shoe)
  cartItems: CartItem[];

  @ManyToOne(() => Category, (category) => category.shoes)
  category: Category[];
}
