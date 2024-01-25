import { Base } from '../../base/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Image } from '../../image/image.entity';
import { Component } from '../../component/entities/component.entity';
import { MaterialType } from './material-type.entity';

@Entity('material')
export class Material extends Base {
  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => MaterialType, (materialType) => materialType.materials)
  type: MaterialType;

  @OneToMany(() => Image, (image) => image.material)
  images: Image[];

  @OneToMany(() => Component, (component) => component.material)
  components: Component[];
}
