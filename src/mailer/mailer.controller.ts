import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendMailDto } from './dto/send-mail.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../modules/role/role.guard';
import { RoleEnum } from '../modules/role/role.enum';
import { Roles } from '../modules/role/role.decorator';
import { JwtAccessGuard } from '../modules/auth/guards/jwt-access.guard';

@ApiBearerAuth()
@ApiTags('Mailer')
@UseGuards(JwtAccessGuard, RoleGuard)
@Roles(RoleEnum.ADMIN)
@Controller({
  path: 'mailer',
})
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  sendEmail(@Body() sendMailDto: SendMailDto) {
    return this.mailerService.sendEmail(sendMailDto);
  }
}
