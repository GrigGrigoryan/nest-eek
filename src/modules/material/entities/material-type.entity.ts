import { Base } from '../../base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { MaterialTypeEnum } from '../material.enum';
import { Material } from './material.entity';

@Entity('material_type')
export class MaterialType extends Base {
  @Column('enum', { nullable: false, enum: MaterialTypeEnum })
  name: MaterialTypeEnum;

  @OneToMany(() => Material, (material) => material.type)
  materials: Material[];
}
