import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { NotFound } from '../../errors/NotFound';
import { BadRequest } from '../../errors/BadRequest';
import { ListModelQueryDto } from '../model/dto/list-model.query.dto';
import { Base } from '../base/base.entity';
import { BaseService } from '../base/base.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly baseService: BaseService,
  ) {}

  async count(): Promise<number> {
    return this.orderRepository.count();
  }

  async findOne(id: Order['id']) {
    const result = await this.orderRepository.findOneBy({ id });
    if (!result) {
      throw new NotFound('order_not_found');
    }
    return result;
  }

  listOrders(
    query: ListModelQueryDto,
  ): Promise<{ result: Base[]; count: number }> {
    return this.baseService.queryEntity(this.orderRepository, query);
  }

  async getOrder(id: Order['id']): Promise<Order | null> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.transactions', 'transaction')
      .where('order.id = :id', { id })
      .orderBy('transaction.providerOrderId', 'DESC')
      .getOne();
    if (!result) {
      throw new BadRequest('order_not_found');
    }
    return result;
  }

  async create(order: Order): Promise<Order | null> {
    return this.orderRepository.save(this.orderRepository.create(order));
  }

  async bulkCreate(orders: Order[]): Promise<void> {
    await this.orderRepository
      .createQueryBuilder()
      .insert()
      .into(Order)
      .values(orders)
      .execute();
  }
}
