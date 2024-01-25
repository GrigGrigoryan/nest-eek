import { Base } from '../../base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ComponentTypeEnum } from '../component.enum';
import { Component } from './component.entity';

@Entity('component_type')
export class ComponentType extends Base {
  @Column('enum', { nullable: false, enum: ComponentTypeEnum })
  name: ComponentTypeEnum;

  @OneToMany(() => Component, (component) => component.type)
  components: Component[];
}
