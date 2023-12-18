import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { Base } from '../base/base.entity';
import { NotFound } from '../../errors/NotFound';
import { ListCartQueryDto } from './dto/list-cart.query.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly baseService: BaseService,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    return this.cartRepository.save(this.cartRepository.create(createCartDto));
  }

  listCarts(
    query: ListCartQueryDto,
  ): Promise<{ result: Base[]; count: number }> {
    return this.baseService.queryEntity(this.cartRepository, query);
  }

  async findOne(id: Cart['id']) {
    const result = await this.cartRepository.findOneBy({ id });
    if (!result) {
      throw new NotFound('cart_not_found');
    }
    return result;
  }

  async update(id: Cart['id'], updateCartDto: UpdateCartDto): Promise<Cart> {
    const existingCart: Cart = await this.findOne(id);

    Object.assign(existingCart, updateCartDto);
    return this.cartRepository.save(existingCart);
  }

  async delete(id: Cart['id']): Promise<Cart> {
    const cart = await this.findOne(id);
    return this.cartRepository.softRemove(cart);
  }
}
