import { Module } from '@nestjs/common';
import { NotificationTemplateService } from './notification-template.service';
import { NotificationTemplateController } from './notification-template.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTemplate } from './notification-template.entity';
import { MailerService } from '../../mailer/mailer.service';
import { BaseService } from '../base/base.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([NotificationTemplate])],
  controllers: [NotificationTemplateController],
  providers: [NotificationTemplateService, MailerService, BaseService],
  exports: [NotificationTemplateService, MailerService],
})
export class NotificationTemplateModule {}
