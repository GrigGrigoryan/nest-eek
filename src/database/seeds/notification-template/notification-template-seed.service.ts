import { Injectable, Logger } from '@nestjs/common';
import { NotificationTemplateService } from '../../../modules/notification-template/notification-template.service';
import { NotificationTemplate } from '../../../modules/notification-template/notification-template.entity';
import {
  NotificationAction,
  NotificationType,
} from '../../../modules/notification-template/notification-template.enum';

@Injectable()
export class NotificationTemplateSeedService {
  private readonly logger: Logger = new Logger(
    NotificationTemplateSeedService.name,
  );
  constructor(
    private readonly notificationTemplateService: NotificationTemplateService,
  ) {}

  async run() {
    const countNotificationTemplateServices =
      await this.notificationTemplateService.count();
    if (countNotificationTemplateServices === 0) {
      const notificationTemplateServices = [
        {
          action: NotificationAction.REGISTER_CONFIRM,
          type: NotificationType.EMAIL,
          subject: 'Mail Confirmation',
          content: '<p>{{data:user_verify_code}}</p>',
        },
        {
          action: NotificationAction.REGISTER_SUCCESS,
          type: NotificationType.EMAIL,
          subject: 'Registration Success',
          content: `<p>Dear {{data:username}}
            You have been registered successfully</p>`,
        },
        {
          action: NotificationAction.ORDER_CONFIRMATION,
          type: NotificationType.EMAIL,
          subject: 'Order Confirmed',
          content: `<p>Your Order confirmed</p>`,
        },
        {
          action: NotificationAction.ORDER_CANCELLATION,
          type: NotificationType.EMAIL,
          subject: 'Order Cancelled',
          content: `<p>Your Order cancelled</p>`,
        },
        {
          action: NotificationAction.BLOCK_USER,
          type: NotificationType.EMAIL,
          subject: 'User Blocked',
          content: `<p>You have been blocked.</p>`,
        },
        {
          action: NotificationAction.UNBLOCK_USER,
          type: NotificationType.EMAIL,
          subject: 'User Unblocked',
          content: `<p>You have been unblocked successfully.</p>`,
        },
        {
          action: NotificationAction.RESET_PASSWORD,
          type: NotificationType.EMAIL,
          subject: 'Password Reset',
          content: `<p>Click <a href="{{data:reset_link}})">here</a> to reset your password.</p>`,
        },
      ] as unknown as NotificationTemplate[];

      await this.notificationTemplateService.bulkCreate(
        notificationTemplateServices,
      );
      this.logger.verbose('Notification template seeded successfully');
    }
  }
}
