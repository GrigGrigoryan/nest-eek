import { Base } from '../base/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CartItem } from '../cart-item/cart-item.entity';
import { Category } from '../category/category.entity';
import { Image } from '../image/image.entity';
import { Model } from '../model/entities/model.entity';

@Entity('shoes')
export class Shoes extends Base {
  @Column()
  size: string;

  @Column()
  color: string;

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

  @ManyToOne(() => Model, (model) => model.shoes)
  model: Model;

  @OneToMany(() => Image, (image) => image.shoes)
  images: Image[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.shoes)
  cartItems: CartItem[];

  @ManyToOne(() => Category, (category) => category.shoes)
  category: Category[];
}
