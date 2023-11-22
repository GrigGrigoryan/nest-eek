import { Column, Entity } from 'typeorm';
import {
  NotificationType,
  NotificationAction,
} from './notification-template.enum';
import { Base } from '../base/base.entity';

@Entity('notification_template')
export class NotificationTemplate extends Base {
  @Column('enum', { enum: NotificationAction, nullable: false })
  action: NotificationAction;

  @Column('enum', { enum: NotificationType, nullable: false })
  type: NotificationType;

  @Column({ nullable: false })
  subject: string;

  @Column({ nullable: false })
  content: string;
}
