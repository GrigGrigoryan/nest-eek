import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NotificationTemplateService } from './notification-template.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../role/role.guard';
import { RoleEnum } from '../role/role.enum';
import { UpdateNotificationTemplateDto } from './dto/update-notification-template.dto';
import { CreateNotificationTemplateDto } from './dto/create-notification-template.dto';
import { Roles } from '../role/role.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { ParamUUID } from '../../decorators/ParamUUID';
import { Throttle } from '@nestjs/throttler';

@ApiBearerAuth()
@ApiTags('Notification Template')
@UseGuards(JwtAccessGuard, RoleGuard)
@Roles(RoleEnum.MANAGER)
@Controller({
  path: 'notification-template',
})
export class NotificationTemplateController {
  constructor(
    private readonly notificationTemplateService: NotificationTemplateService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNotificationTemplateDto: CreateNotificationTemplateDto) {
    return this.notificationTemplateService.create(
      createNotificationTemplateDto,
    );
  }

  @Throttle(30, 60)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.notificationTemplateService.listNotificationTemplates();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@ParamUUID('id') id: string) {
    return this.notificationTemplateService.findOneBy({ id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @ParamUUID('id') id: string,
    @Body() updateNotificationTemplateDto: UpdateNotificationTemplateDto,
  ) {
    return this.notificationTemplateService.update(
      id,
      updateNotificationTemplateDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@ParamUUID('id') id: string) {
    return this.notificationTemplateService.delete(id);
  }
}
