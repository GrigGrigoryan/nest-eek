import { Base } from '../base/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { shoes } from '../shoes/shoes.entity';
import { Accessory } from '../accessory/accessory.entity';

@Entity('image')
export class Image extends Base {
  @Column()
  name: string;

  @ManyToOne(() => shoes, (shoes) => shoes.images)
  shoes: shoes;

  @ManyToOne(() => Accessory, (accessory) => accessory.images)
  accessory: Accessory;
}
