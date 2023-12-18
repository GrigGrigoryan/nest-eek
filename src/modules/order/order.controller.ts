import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../role/role.guard';
import { OrderService } from './order.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { ParamUUID } from '../../decorators/ParamUUID';
import { Throttle } from '@nestjs/throttler';
import { ListOrderQueryDto } from './dto/list-order.query.dto';

@ApiBearerAuth()
@ApiTags('Order')
@UseGuards(JwtAccessGuard, RoleGuard)
@Controller({
  path: 'order',
})
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Throttle(30, 60)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query(new ValidationPipe()) query: ListOrderQueryDto) {
    return this.orderService.listOrders(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@ParamUUID('id') id: string) {
    return this.orderService.findOne(id);
  }
}
