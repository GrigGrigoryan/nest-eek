import { Base } from '../../base/base.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Image } from '../../image/image.entity';
import { Material } from '../../material/entities/material.entity';
import { Model } from '../../model/entities/model.entity';
import { ComponentType } from './component-type.entity';

@Entity('component')
export class Component extends Base {
  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => ComponentType, (componentType) => componentType.components)
  type: ComponentType;

  @ManyToOne(() => Material, (material) => material.components)
  material: Material;

  @OneToMany(() => Image, (image) => image.component)
  images: Image[];

  @ManyToMany(() => Model, (model) => model.components)
  models: Model[];
}
