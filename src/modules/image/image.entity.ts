import { Base } from '../base/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Shoe } from '../shoe/shoe.entity';
import { ShoePin } from '../shoe-pin/shoe-pin.entity';

@Entity('image')
export class Image extends Base {
  @Column()
  name: string;

  @ManyToOne(() => Shoe, (shoe) => shoe.images)
  shoe: Shoe;

  @ManyToOne(() => ShoePin, (shoePin) => shoePin.images)
  shoePin: ShoePin;
}
