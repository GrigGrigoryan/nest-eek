import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Order } from './order.entity';
import { NotFound } from '../../errors/NotFound';
import { BadRequest } from '../../errors/BadRequest';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async count(): Promise<number> {
    return this.orderRepository.count();
  }

  async findOne(options: FindOneOptions<Order>): Promise<Order | null> {
    const result = await this.orderRepository.findOne(options);
    if (!result) {
      throw new NotFound('order_not_found');
    }
    return result;
  }

  async getOrder(id: Order['id']): Promise<Order | null> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.transactions', 'transaction')
      .leftJoinAndSelect('order.flowState', 'flowState')
      .leftJoinAndSelect('flowState.orderProcess', 'orderProcess')
      .leftJoinAndSelect('flowState.payable', 'payable')
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
