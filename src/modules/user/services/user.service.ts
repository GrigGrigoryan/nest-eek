import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions, In, Repository } from 'typeorm';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NotFound } from '../../../errors/NotFound';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { RoleService } from '../../role/role.service';
import { RoleEnum } from '../../role/role.enum';
import { Forbidden } from '../../../errors/Forbidden';
import { UserVerifyBy } from '../user.enum';
import { UserVerify } from '../entities/user-verify.entity';
import { LoginProvider } from '../../auth/auth.enum';
import { BadRequest } from '../../../errors/BadRequest';
import { UserVerifyService } from './user-verify.service';
import { JwtPayload } from '../../auth/auth.types';
import { Unauthorized } from '../../../errors/Unauthorized';
import { Base } from '../../base/base.entity';
import { QueryUserDto } from '../dto/list-user.dto';
import { BaseService } from '../../base/base.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../../auth/dto/auth-password-reset.dto';
import { generateUserVerifyCode } from '../../../utils/generator';
import {
  NotificationAction,
  NotificationType,
} from '../../notification-template/notification-template.enum';
import { ConfigService } from '@nestjs/config';
import { NotificationTemplateService } from '../../notification-template/notification-template.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly entityManager: EntityManager,
    private readonly baseService: BaseService,
    private readonly configService: ConfigService,
    private readonly notificationTemplateService: NotificationTemplateService,
    private readonly userVerifyService: UserVerifyService,
  ) {}

  findAdminsByIds(ids: User['id'][]): Promise<User[]> {
    return this.userRepository.find({
      where: { id: In(ids), role: { name: RoleEnum.ADMIN } },
      relations: ['role'],
    });
  }

  async createOAuthUser(provider: LoginProvider, profile: any): Promise<User> {
    Base._currentUserId = null; // clear currentUserId

    const identifier = `${provider}-${profile.id}`;

    const role = await this.roleService.getRole({ name: RoleEnum.CLIENT });

    let user: User;
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      const userVerify = transactionalEntityManager.create(UserVerify, {
        verifyBy: UserVerifyBy.PROVIDER,
        verifiedDate: new Date(),
      });
      await transactionalEntityManager.save(UserVerify, userVerify);

      user = transactionalEntityManager.create(User, {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0]?.value,
        username: profile.emails[0]?.value || `@${profile.id}`,
        identifier,
        userVerify,
        role,
      });
      await transactionalEntityManager.save(User, user);
    });

    return this.getUser({
      where: { id: user.id },
      relations: ['userVerify', 'role'],
    });
  }

  count(where: EntityCondition<User>): Promise<number> {
    return this.userRepository.count({ where });
  }

  async listClients(
    query: QueryUserDto,
  ): Promise<{ result: Base[]; count: number }> {
    query.rolesToInclude = [RoleEnum.CLIENT];
    return this.baseService.queryEntity(this.userRepository, query);
  }

  async listAdmins(
    query: QueryUserDto,
  ): Promise<{ result: Base[]; count: number }> {
    query.rolesToExclude = [RoleEnum.SUPER_ADMIN, RoleEnum.CLIENT];
    return this.baseService.queryEntity(this.userRepository, query);
  }

  async getUser(options: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(options);
  }
  async getUserBy(where: EntityCondition<User>): Promise<User> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.createdBy', 'createdBy')
      .leftJoinAndSelect('user.updatedBy', 'updatedBy')
      .leftJoin('user.role', 'role')
      .addSelect([
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
        'updatedBy.id',
        'updatedBy.firstName',
        'updatedBy.lastName',
      ])
      .where(where)
      .getOne();
    if (!result) {
      throw new NotFound('user_not_found');
    }
    return result;
  }
  async getUserLoginInfo(where: EntityCondition<User>): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.userVerify', 'userVerify')
      .where(where)
      .select([
        'user.id',
        'user.password',
        'user.firstName',
        'user.lastName',
        'user.blockedAt',
        'role.id',
        'role.name',
        'userVerify.id',
        'userVerify.verifiedDate',
        'userVerify.verifyToken',
        'userVerify.verifyCode',
      ])
      .getOne();
    if (!user) {
      throw new NotFound('user_not_found');
    }
    if (user.blockedAt) {
      throw new Unauthorized('user_blocked');
    }
    if (!user.userVerify?.verifiedDate) {
      throw new Unauthorized('user_not_verified');
    }
    return user;
  }

  async verifyUser(userVerify: UserVerify): Promise<UserVerify> {
    userVerify.verifiedDate = new Date();
    userVerify.verifyToken = null;
    userVerify.verifyCode = null;

    return this.userVerifyService.save(userVerify);
  }
  async setVerifyToken(userVerify: UserVerify): Promise<UserVerify> {
    userVerify.verifyToken = uuidv4();
    userVerify.verifyCode = generateUserVerifyCode(6);

    return this.userVerifyService.save(userVerify);
  }
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<UserVerify['verifyToken']> {
    const user = await this.getUserLoginInfo({
      email: forgotPasswordDto.email,
    });
    const frontendDomain = this.configService.get<string>('app.frontendDomain');

    const { verifyCode, verifyToken } = await this.setVerifyToken(
      user.userVerify,
    );

    const reset_link = `${frontendDomain}/reset-password?code=${verifyCode}`;

    await this.notificationTemplateService.send(
      user.email,
      {
        action: NotificationAction.RESET_PASSWORD,
        type: NotificationType.EMAIL,
      },
      {
        reset_link,
      },
    );

    return verifyToken;
  }
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, verifyToken, verifyCode, password, passwordConfirm } =
      resetPasswordDto;

    const user = await this.getUserLoginInfo({
      email,
    });

    if (
      verifyToken !== user.userVerify.verifyToken ||
      verifyCode !== user.userVerify.verifyCode
    ) {
      throw new BadRequest('tokens_are_invalid');
    }
    if (password !== passwordConfirm) {
      throw new BadRequest('passwords_not_matching');
    }

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(UserVerify, {
        ...user.userVerify,
        verifyCode: null,
        verifyToken: null,
      });
      await transactionalEntityManager.save(User, {
        ...user,
        password,
      });
    });
  }

  async validateUserByToken(payload: JwtPayload): Promise<User> {
    if (!payload.id) {
      throw new Forbidden('invalid_token_payload');
    }
    const user = await this.getUser({
      where: { id: payload.id },
      relations: ['userVerify', 'role'],
    });
    if (!user) {
      throw new NotFound('user_not_found');
    }
    if (user.blockedAt) {
      throw new Unauthorized('user_blocked');
    }
    if (!user.userVerify?.verifiedDate) {
      throw new Unauthorized('user_not_verified');
    }

    Base._currentUserId = payload.id; // Set the current user's ID for updatedBy and createdBy

    return user;
  }

  async getUserByVerifyToken(
    verifyToken: UserVerify['verifyToken'],
  ): Promise<User> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userVerify', 'userVerify')
      .where('userVerify.verifyToken = :verifyToken', { verifyToken })
      .getOne()
      .catch((err: any) => {
        throw err;
      });

    if (!result) {
      throw new NotFound('user_not_found');
    }
    return result;
  }

  async create(createDto: CreateUserDto): Promise<User> {
    const role = await this.roleService.getRole({ id: createDto.role.id });
    if (!role) {
      throw new NotFound('role_not_found');
    }
    if (role.name === RoleEnum.SUPER_ADMIN) {
      const superAdminCount = await this.userRepository.count({
        where: { role: { name: RoleEnum.SUPER_ADMIN } },
      });

      if (superAdminCount) {
        throw new BadRequest('role_not_allowed');
      }
    }

    let user: User;
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      const userVerify = transactionalEntityManager.create(UserVerify, {
        verifyBy: UserVerifyBy.ADMIN,
        verifiedDate: new Date(),
      });
      await transactionalEntityManager.save(UserVerify, userVerify);

      user = transactionalEntityManager.create(User, {
        ...createDto,
        role,
        userVerify,
      });
      await transactionalEntityManager.save(User, user);
    });

    return this.userRepository.findOneBy({ id: user.id });
  }

  async update(id: User['id'], updateProfileDto: UpdateUserDto) {
    const existingUser: User = await this.getUserBy({ id });

    if (updateProfileDto.role?.name === RoleEnum.SUPER_ADMIN) {
      const superAdminCount = await this.userRepository.count({
        where: { role: { name: RoleEnum.SUPER_ADMIN } },
      });
      if (superAdminCount) {
        throw new Forbidden('role_not_allowed');
      }
    }

    Object.assign(existingUser, updateProfileDto);

    return this.userRepository.save(existingUser);
  }

  async delete(id: User['id']): Promise<User> {
    const user = await this.getUserBy({ id });
    return this.userRepository.softRemove(user);
  }
}
