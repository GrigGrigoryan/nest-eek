import {
  Entity,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../order/order.entity';
import { Transaction } from '../../transaction/transaction.entity';
import * as bcrypt from 'bcrypt';
import { Base } from '../../base/base.entity';
import { Role } from '../../role/role.entity';
import { Exclude, Expose } from 'class-transformer';
import { UserVerify } from './user-verify.entity';

@Entity('user')
export class User extends Base {
  @Column({ unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Column({ unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  phone: string | null;

  @Index()
  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: true /*, transformer: new EncryptionTransformer()*/ })
  @Exclude({ toPlainOnly: true })
  password: string | null;

  @Index()
  @Column({ nullable: true })
  firstName: string | null;

  @Index()
  @Column({ nullable: true })
  lastName: string | null;

  @Index()
  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  identifier: string | null;

  @Column({ nullable: true })
  blockedAt: Date;

  @OneToOne(() => UserVerify, (userVerify) => userVerify.user)
  @JoinColumn()
  userVerify: UserVerify;

  @ManyToOne(() => Role, {
    // eager: true,
  })
  role?: Role | null;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
