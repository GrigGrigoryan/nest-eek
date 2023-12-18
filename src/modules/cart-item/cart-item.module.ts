import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { BaseService } from '../base/base.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  controllers: [CartItemController],
  providers: [CartItemService, BaseService],
})
export class CartItemModule {}
