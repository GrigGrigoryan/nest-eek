import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  NotificationType,
  NotificationAction,
} from '../notification-template.enum';

export class CreateNotificationTemplateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(NotificationAction)
  action: NotificationAction;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
