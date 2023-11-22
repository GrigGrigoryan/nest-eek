import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';

export class Base extends BaseEntity {
  static _currentUserId: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User['id'];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: User['id'];

  @BeforeInsert()
  setCreatedBy() {
    this.createdBy = Base._currentUserId;
  }

  @BeforeUpdate()
  setUpdatedBy() {
    this.updatedBy = Base._currentUserId;
  }
}
