import { Base } from '../base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Accessory } from '../accessory/accessory.entity';
import { Shoes } from '../shoes/shoes.entity';

//todo
@Entity('category')
export class Category extends Base {
  @Column()
  name: string;

  @OneToMany(() => Shoes, (shoes) => shoes.category)
  shoes: Shoes[];

  @OneToMany(() => Accessory, (accessory) => accessory.category)
  accessories: Accessory[];
}
