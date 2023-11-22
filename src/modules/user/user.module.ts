import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { RoleService } from '../role/role.service';
import { Role } from '../role/role.entity';
import { UserVerify } from './entities/user-verify.entity';
import { UserVerifyService } from './services/user-verify.service';
import { BaseService } from '../base/base.service';
import { NotificationTemplateService } from '../notification-template/notification-template.service';
import { NotificationTemplate } from '../notification-template/notification-template.entity';
import { MailerService } from '../../mailer/mailer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserVerify, Role, NotificationTemplate]),
  ],
  controllers: [UserController],
  providers: [
    IsExist,
    IsNotExist,
    UserService,
    UserVerifyService,
    NotificationTemplateService,
    MailerService,
    RoleService,
    BaseService,
  ],
  exports: [UserService, UserVerifyService, RoleService, MailerService],
})
export class UserModule {}
