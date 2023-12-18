import { Base } from '../base/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Shoes } from '../shoes/shoes.entity';
import { Accessory } from '../accessory/accessory.entity';
import { Material } from '../material/entities/material.entity';
import { Component } from '../component/entities/component.entity';

@Entity('image')
export class Image extends Base {
  @Column()
  name: string;

  @ManyToOne(() => Shoes, (shoes) => shoes.images)
  shoes: Shoes;

  @ManyToOne(() => Accessory, (accessory) => accessory.images)
  accessory: Accessory;

  @ManyToOne(() => Material, (material) => material.images)
  material: Material;

  @ManyToOne(() => Component, (component) => component.images)
  component: Component;
}
