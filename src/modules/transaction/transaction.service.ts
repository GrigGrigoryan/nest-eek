import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Base } from '../base/base.entity';
import { BaseService } from '../base/base.service';
import { QueryTransactionDto } from './dto/list-transaction.dto';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { ConfigService } from '@nestjs/config';
import { NotFound } from '../../errors/NotFound';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly baseService: BaseService,
    private readonly configService: ConfigService,
  ) {}

  async listTransactions(
    query: QueryTransactionDto,
  ): Promise<{ result: Base[]; count: number }> {
    return this.baseService.queryEntity(this.transactionRepository, query);
  }

  async getTransaction(
    where: EntityCondition<Transaction>,
  ): Promise<Transaction> {
    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where(where)
      .leftJoinAndSelect('transaction.createdBy', 'createdBy')
      .leftJoinAndSelect('transaction.updatedBy', 'updatedBy')
      .addSelect([
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
        'updatedBy.id',
        'updatedBy.firstName',
        'updatedBy.lastName',
      ])
      .getOne();

    if (!result) {
      throw new NotFound('transaction_not_found');
    }
    return result;
  }

  async generateProviderOrderId(): Promise<number> {
    const [minRange, maxRange] = this.configService.get<[number, number]>(
      'payment.providerOrderIdRange',
    );
    // Retrieve the current maximum providerOrderId from the database
    const currentMax = await this.transactionRepository.find({
      order: { providerOrderId: 'DESC' },
      skip: 0, // Skip 0 rows
      take: 1, // Take only 1 row
    });

    // Calculate the next value based on the current maximum
    return currentMax.length
      ? Math.min(currentMax[0]?.providerOrderId + 1, maxRange)
      : minRange;
  }

  async delete(id: Transaction['id']): Promise<Transaction> {
    const transaction = await this.getTransaction({ id });
    return this.transactionRepository.softRemove(transaction);
  }

  async bulkCreate(transactions: Transaction[]): Promise<void> {
    await this.transactionRepository
      .createQueryBuilder()
      .insert()
      .into(Transaction)
      .values(transactions)
      .execute();
  }
}
