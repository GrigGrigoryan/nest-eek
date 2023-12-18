import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { OrderController } from './order.controller';
import { BaseService } from '../base/base.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [OrderService, BaseService],
  exports: [OrderService],
})
export class OrderModule {}
