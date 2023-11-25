import { Base } from '../base/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CartItem } from '../cart-item/cart-item.entity';
import { Category } from '../category/category.entity';
import { Image } from '../image/image.entity';

@Entity('shoes')
export class shoes extends Base {
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

  @OneToMany(() => Image, (image) => image.shoes)
  images: Image[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.shoes)
  cartItems: CartItem[];

  @ManyToOne(() => Category, (category) => category.shoes)
  category: Category[];
}