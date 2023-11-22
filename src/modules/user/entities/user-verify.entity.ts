import { Column, Entity, OneToOne } from 'typeorm';
import { Base } from '../../base/base.entity';
import { User } from './user.entity';
import { UserVerifyBy } from '../user.enum';

@Entity('user_verify')
export class UserVerify extends Base {
  @Column({ nullable: true })
  verifyCode: string;

  @Column({ nullable: true })
  verifyToken: string;

  @Column({ nullable: true })
  verifiedDate: Date;

  @Column('enum', { nullable: false, enum: UserVerifyBy })
  verifyBy: UserVerifyBy;

  @OneToOne(() => User, (user) => user.userVerify)
  user: User;
}
