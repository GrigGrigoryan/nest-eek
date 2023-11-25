import { Shoe } from '../shoe/shoe.entity';
import { Base } from '../base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ShoePin } from '../shoe-pin/shoe-pin.entity';

@Entity('category')
export class Category extends Base {
  @Column()
  name: string;

  @OneToMany(() => Shoe, (shoe) => shoe.category)
  shoes: Shoe[];

  @OneToMany(() => ShoePin, (shoePin) => shoePin.category)
  shoePins: ShoePin[];
}
