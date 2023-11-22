import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../role/role.guard';
import { ConfigService } from '@nestjs/config';
import { Roles } from '../role/role.decorator';
import { RoleEnum } from '../role/role.enum';
import { OrderService } from './order.service';
import { Forbidden } from '../../errors/Forbidden';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { User } from '../user/entities/user.entity';
import { ParamUUID } from '../../decorators/ParamUUID';

@ApiBearerAuth()
@ApiTags('Order')
@UseGuards(JwtAccessGuard, RoleGuard)
@Controller({
  path: 'order',
})
export class OrderController {
  constructor(
    private readonly configService: ConfigService,
    private readonly orderService: OrderService,
  ) {}

  @Get(':id')
  @Roles(RoleEnum.CLIENT)
  @HttpCode(HttpStatus.OK)
  async getOrder(
    @Request() { user }: { user: User },
    @ParamUUID('id') id: string,
  ) {
    const order = await this.orderService.findOne({
      where: { id },
      relations: ['user'],
    });

    if (order.user?.id !== user.id) {
      throw new Forbidden('order_no_access');
    }

    return order;
  }
}
