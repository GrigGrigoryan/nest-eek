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
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RoleGuard } from '../role/role.guard';
import { TransactionService } from './transaction.service';
import { RoleEnum } from '../role/role.enum';
import { Roles } from '../role/role.decorator';
import { QueryTransactionDto } from './dto/list-transaction.dto';
import { ParamUUID } from '../../decorators/ParamUUID';
import { Throttle } from '@nestjs/throttler';

@ApiBearerAuth()
@ApiTags('Transaction')
@UseGuards(JwtAccessGuard, RoleGuard)
@Controller({
  path: 'transaction',
})
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Throttle(30, 60)
  @Roles(RoleEnum.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query(new ValidationPipe()) query: QueryTransactionDto) {
    return this.transactionService.listTransactions(query);
  }

  @Roles(RoleEnum.ADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getTransaction(@ParamUUID('id') id: string) {
    return this.transactionService.getTransaction({ id });
  }
}
