import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { RoleEnum } from 'src/modules/role/role.enum';
import { Role } from 'src/modules/role/role.entity';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { UnprocessableEntity } from 'src/errors/UnprocessableEntity';
import { RoleService } from 'src/modules/role/role.service';
import { Unauthorized } from 'src/errors/Unauthorized';
import { v4 as uuidv4 } from 'uuid';
import { generateUserVerifyCode } from '../../utils/generator';
import { EntityManager } from 'typeorm';
import { UserVerify } from '../user/entities/user-verify.entity';
import { UserVerifyBy } from '../user/user.enum';
import {
  NotificationAction,
  NotificationType,
} from '../notification-template/notification-template.enum';
import { NotificationTemplateService } from '../notification-template/notification-template.service';
import { LoginProvider } from './auth.enum';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './auth.types';
import { BadRequest } from '../../errors/BadRequest';
import { InternalServerError } from '../../errors/InternalServerError';
import { Base } from '../base/base.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly entityManager: EntityManager,
    private readonly notificationTemplateService: NotificationTemplateService,
  ) {}

  async validateLogin(
    loginDto: AuthLoginDto,
    isAdmin: boolean,
  ): Promise<{
    accessToken: string;
    refreshToken?: string;
    firstName: User['firstName'];
    lastName: User['lastName'];
  }> {
    const user = await this.userService.getUserLoginInfo({
      username: loginDto.username,
    });

    const allowedRoles = isAdmin
      ? [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN]
      : [RoleEnum.CLIENT];

    if (!allowedRoles.includes(user?.role?.name as RoleEnum)) {
      throw new UnprocessableEntity('user_not_found');
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequest('incorrect_password');
    }

    const { accessToken, refreshToken } = this.generateTokens(
      user,
      loginDto.rememberMe,
    );

    return {
      accessToken,
      refreshToken,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  generateTokens(user: User, withRefreshToken: boolean) {
    const accessTokenOptions = {
      secret: this.configService.get<string>('auth.accessSecret'),
      expiresIn: this.configService.get<string>('auth.accessExpires'),
    };

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role?.name,
    };

    const accessToken = this.jwtService.sign(payload, accessTokenOptions);

    let refreshToken: string;
    if (withRefreshToken) {
      const refreshTokenOptions = {
        secret: this.configService.get<string>('auth.refreshSecret'),
        expiresIn: this.configService.get<string>('auth.refreshExpires'),
      };

      refreshToken = this.jwtService.sign(payload, refreshTokenOptions);
    }

    return { accessToken, refreshToken };
  }

  async register(dto: AuthRegisterDto): Promise<User> {
    const verifyBy = !dto.phone ? UserVerifyBy.EMAIL : UserVerifyBy.PHONE;
    const notificationType =
      verifyBy === UserVerifyBy.EMAIL
        ? NotificationType.EMAIL
        : NotificationType.SMS;

    const sendTo = verifyBy === UserVerifyBy.EMAIL ? dto.email : dto.phone;

    const verifyToken: string = uuidv4();
    const verifyCode: string = generateUserVerifyCode(6);

    const role: Role = await this.roleService.getRole({
      name: RoleEnum.CLIENT,
    });

    let user: User;
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      const userVerify = transactionalEntityManager.create(UserVerify, {
        verifyCode,
        verifyToken,
        verifyBy,
      });
      await transactionalEntityManager.save(UserVerify, userVerify);

      user = transactionalEntityManager.create(User, {
        ...dto,
        role,
        userVerify,
      });
      await transactionalEntityManager.save(User, user);

      await this.notificationTemplateService.send(
        sendTo,
        {
          action: NotificationAction.REGISTER_CONFIRM,
          type: notificationType,
        },
        {
          username: user.username,
          user_verify_code: verifyCode,
        },
      );
    });

    return this.userService.getUser({
      where: { id: user.id },
      relations: ['userVerify'],
    });
  }

  async me(id: User['id']): Promise<User> {
    return this.userService.getUser({
      where: { id },
      select: ['firstName', 'lastName'],
    });
  }

  async update(id: User['id'], userDto: AuthUpdateDto): Promise<User> {
    await this.userService.update(id, userDto);

    return this.userService.getUser({
      where: { id },
      select: ['firstName', 'lastName'],
    });
  }

  async delete(id: User['id']): Promise<void> {
    await this.userService.delete(id);
  }

  async validateOAuthLogin(
    profile: any,
    provider: LoginProvider,
  ): Promise<User> {
    if (!profile) {
      throw new InternalServerError(`${provider}_auth_error`);
    }
    const email = profile.emails[0]?.value || `@${profile.id}`;

    let user = await this.userService.getUser({
      where: { email },
      relations: ['userVerify', 'role'],
    });

    if (!user) {
      user = await this.userService.createOAuthUser(provider, profile);

      await this.notificationTemplateService.send(
        email,
        {
          action: NotificationAction.REGISTER_SUCCESS,
          type: NotificationType.EMAIL,
        },
        {
          username: user.username,
        },
      );
    }
    if (user.blockedAt) {
      throw new Unauthorized('user_blocked');
    }
    if (!user.userVerify?.verifiedDate) {
      throw new Unauthorized('user_not_verified');
    }

    Base._currentUserId = user.id; // Set the current user's ID for updatedBy and createdBy

    return user;
  }
}
