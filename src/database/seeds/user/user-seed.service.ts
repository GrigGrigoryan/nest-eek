import { Injectable, Logger } from '@nestjs/common';
import { RoleEnum } from 'src/modules/role/role.enum';
import { UserService } from 'src/modules/user/services/user.service';
import { RoleService } from 'src/modules/role/role.service';

@Injectable()
export class UserSeedService {
  private readonly logger: Logger = new Logger(UserSeedService.name);
  constructor(
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  async run() {
    const countAdmin = await this.userService.count({
      role: {
        name: RoleEnum.ADMIN,
      },
    });

    if (countAdmin === 0) {
      const role = await this.roleService.getRole({
        name: RoleEnum.ADMIN,
      });

      await this.userService.create({
        username: 'adminious',
        firstName: 'Admin',
        lastName: 'Adminyan',
        email: 'admin@example.com',
        password: 'secret',
        role,
      });
      this.logger.verbose('Admin seeded successfully');
    }

    const countSuperAdmin = await this.userService.count({
      role: {
        name: RoleEnum.SUPER_ADMIN,
      },
    });

    if (countSuperAdmin === 0) {
      const role = await this.roleService.getRole({
        name: RoleEnum.SUPER_ADMIN,
      });

      await this.userService.create({
        username: 'superious',
        firstName: 'Super',
        lastName: 'Admin',
        email: 'super.admin@example.com',
        password: 'secret',
        role,
      });
      this.logger.verbose('Super admin seeded successfully');
    }

    const countManager = await this.userService.count({
      role: {
        name: RoleEnum.MANAGER,
      },
    });

    if (countManager === 0) {
      const role = await this.roleService.getRole({
        name: RoleEnum.MANAGER,
      });

      await this.userService.create({
        username: 'managerious',
        firstName: 'Manager',
        lastName: 'Manageryan',
        email: 'manager@example.com',
        password: 'secret',
        role,
      });
      this.logger.verbose('Manager seeded successfully');
    }

    const countUser = await this.userService.count({
      role: {
        name: RoleEnum.CLIENT,
      },
    });

    if (countUser === 0) {
      const role = await this.roleService.getRole({
        name: RoleEnum.CLIENT,
      });

      await this.userService.create({
        username: 'johnnie',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'secret',
        role,
      });
      this.logger.verbose('User client seeded successfully');
    }
  }
}
