import { shoes } from '../shoes/shoes.entity';
import { Base } from '../base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Accessory } from '../accessory/accessory.entity';

@Entity('category')
export class Category extends Base {
  @Column()
  name: string;

  @OneToMany(() => shoes, (shoes) => shoes.category)
  shoes: shoes[];

  @OneToMany(() => Accessory, (accessory) => accessory.category)
  accessories: Accessory[];
}
