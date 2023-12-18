import { Base } from '../../base/base.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { MaterialType } from '../../material/material.enum';
import { Image } from '../../image/image.entity';
import { Material } from '../../material/entities/material.entity';
import { ComponentType } from '../component.enum';
import { Model } from '../../model/entities/model.entity';

@Entity('component')
export class Component extends Base {
  @Column('enum', { nullable: false, enum: MaterialType })
  type: ComponentType;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Material, (material) => material.components)
  material: Material;

  @OneToMany(() => Image, (image) => image.component)
  images: Image[];

  @ManyToMany(() => Model, (model) => model.components)
  models: Model[];
}
