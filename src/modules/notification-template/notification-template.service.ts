import { Injectable } from '@nestjs/common';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTemplate } from './notification-template.entity';
import { NotificationType } from './notification-template.enum';
import { MailerService } from '../../mailer/mailer.service';
import { CreateNotificationTemplateDto } from './dto/create-notification-template.dto';
import { UpdateNotificationTemplateDto } from './dto/update-notification-template.dto';
import { NotFound } from '../../errors/NotFound';

@Injectable()
export class NotificationTemplateService {
  constructor(
    @InjectRepository(NotificationTemplate)
    private readonly notificationTemplateRepository: Repository<NotificationTemplate>,
    private readonly mailerService: MailerService,
  ) {}

  async count(): Promise<number> {
    return this.notificationTemplateRepository.count();
  }

  listNotificationTemplates(): Promise<NotificationTemplate[]> {
    return this.notificationTemplateRepository.find();
  }

  create(
    createNotificationTemplateDto: CreateNotificationTemplateDto,
  ): Promise<NotificationTemplate | null> {
    return this.notificationTemplateRepository.save(
      this.notificationTemplateRepository.create(createNotificationTemplateDto),
    );
  }
  async update(
    id: NotificationTemplate['id'],
    updateNotificationTemplateDto: UpdateNotificationTemplateDto,
  ): Promise<NotificationTemplate | null> {
    const notificationTemplate = await this.findOneBy({ id });
    Object.assign(notificationTemplate, updateNotificationTemplateDto);

    return this.notificationTemplateRepository.save(notificationTemplate);
  }

  async delete(id: NotificationTemplate['id']): Promise<NotificationTemplate> {
    const notificationTemplate = await this.findOneBy({ id });
    return this.notificationTemplateRepository.softRemove(notificationTemplate);
  }

  async bulkCreate(
    notificationTemplates: NotificationTemplate[],
  ): Promise<void> {
    await this.notificationTemplateRepository
      .createQueryBuilder()
      .insert()
      .into(NotificationTemplate)
      .values(notificationTemplates)
      .execute();
  }

  async send(
    to: string,
    condition: EntityCondition<NotificationTemplate>,
    data: { [key: string]: string },
  ) {
    const template = await this.findOneBy(condition);

    const html = this.generateNotificationContent(template.content, data);

    // add phone provider, can be Twilio
    // create sms templates
    if (condition.type === NotificationType.EMAIL) {
      await this.mailerService.sendEmail({
        to,
        subject: template.subject,
        text: '@',
        html,
      });
    }
  }

  async findOneBy(
    where: EntityCondition<NotificationTemplate>,
  ): Promise<NotificationTemplate> {
    const result = await this.notificationTemplateRepository.findOneBy(where);

    if (!result) {
      throw new NotFound('notification_template_not_found');
    }
    return result;
  }

  generateNotificationContent(
    content: NotificationTemplate['content'],
    templateTokenData: { [key: string]: string },
  ) {
    const matches = content.match(/((?![}])(?![{]).)+/g);

    if (Array.isArray(matches)) {
      for (const match of matches) {
        if (match.indexOf('data:') > -1) {
          const index = match.indexOf('data:');
          const dataKey = match.slice(index + 5, match.length);

          if (Object.keys(templateTokenData).includes(dataKey)) {
            content = content.replace(
              `{{${match}}}`,
              templateTokenData[dataKey],
            );
          } else {
            content = content.replace(`{{${match}}}`, dataKey);
          }
        }
      }
    }

    return content;
  }
}
