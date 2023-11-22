import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNotificationTemplateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content?: string;
}
