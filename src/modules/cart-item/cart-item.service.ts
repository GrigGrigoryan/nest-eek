import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { Base } from '../base/base.entity';
import { NotFound } from '../../errors/NotFound';
import { ListCartItemQueryDto } from './dto/list-cart-item.query.dto';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './cart-item.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly baseService: BaseService,
  ) {}

  async create(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    return this.cartItemRepository.save(
      this.cartItemRepository.create(createCartItemDto),
    );
  }

  listCartItems(
    query: ListCartItemQueryDto,
  ): Promise<{ result: Base[]; count: number }> {
    return this.baseService.queryEntity(this.cartItemRepository, query);
  }

  async findOne(id: CartItem['id']) {
    const result = await this.cartItemRepository.findOneBy({ id });
    if (!result) {
      throw new NotFound('cart_item_not_found');
    }
    return result;
  }

  async update(
    id: CartItem['id'],
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const existingCartItem: CartItem = await this.findOne(id);

    Object.assign(existingCartItem, updateCartItemDto);
    return this.cartItemRepository.save(existingCartItem);
  }

  async delete(id: CartItem['id']): Promise<CartItem> {
    const cartItem = await this.findOne(id);
    return this.cartItemRepository.softRemove(cartItem);
  }
}
