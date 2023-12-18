import { Base } from '../../base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Image } from '../../image/image.entity';
import { MaterialType } from '../material.enum';
import { Component } from '../../component/entities/component.entity';

@Entity('material')
export class Material extends Base {
  @Column('enum', { nullable: false, enum: MaterialType })
  type: MaterialType;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  color: string;

  @OneToMany(() => Image, (image) => image.material)
  images: Image[];

  @OneToMany(() => Component, (component) => component.material)
  components: Component[];
}
