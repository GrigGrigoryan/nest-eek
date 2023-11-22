import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { TransactionController } from './transaction.controller';
import { BaseService } from '../base/base.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionController],
  providers: [TransactionService, BaseService],
  exports: [TransactionService],
})
export class TransactionModule {}
