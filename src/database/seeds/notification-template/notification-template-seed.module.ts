import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTemplateSeedService } from './notification-template-seed.service';
import { NotificationTemplateService } from '../../../modules/notification-template/notification-template.service';
import { NotificationTemplate } from '../../../modules/notification-template/notification-template.entity';
import { MailerService } from '../../../mailer/mailer.service';
import { BaseService } from '../../../modules/base/base.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationTemplate])],
  providers: [
    NotificationTemplateSeedService,
    NotificationTemplateService,
    MailerService,
    BaseService,
  ],
  exports: [NotificationTemplateSeedService],
})
export class NotificationTemplateSeedModule {}
