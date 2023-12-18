import { Base } from '../../base/base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Shoes } from '../../shoes/shoes.entity';
import { Component } from '../../component/entities/component.entity';
import { ModelType } from '../model.enum';

@Entity('model')
export class Model extends Base {
  @Column('enum', { nullable: false, enum: ModelType })
  type: ModelType;

  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => Component, (component) => component.models)
  @JoinTable()
  components: Component[];

  @OneToMany(() => Shoes, (shoes) => shoes.model)
  shoes: Shoes[];
}
