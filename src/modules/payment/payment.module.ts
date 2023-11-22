import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderService } from '../order/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/order.entity';
import { UserModule } from '../user/user.module';
import { TransactionService } from '../transaction/transaction.service';
import { Transaction } from '../transaction/transaction.entity';
import { BaseService } from '../base/base.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Order, Transaction])],
  controllers: [PaymentController],
  providers: [PaymentService, OrderService, TransactionService, BaseService],
})
export class PaymentModule {}
