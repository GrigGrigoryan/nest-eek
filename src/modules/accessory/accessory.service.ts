import { Injectable } from '@nestjs/common';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { Base } from '../base/base.entity';
import { NotFound } from '../../errors/NotFound';
import { Accessory } from './accessory.entity';
import { Repository } from 'typeorm';
import { ListAccessoryQueryDto } from './dto/list-accessory.query.dto';

@Injectable()
export class AccessoryService {
  constructor(
    @InjectRepository(Accessory)
    private readonly accessoryRepository: Repository<Accessory>,
    private readonly baseService: BaseService,
  ) {}

  async create(createAccessoryDto: CreateAccessoryDto): Promise<Accessory> {
    return this.accessoryRepository.save(
      this.accessoryRepository.create(createAccessoryDto),
    );
  }

  listAccessories(
    query: ListAccessoryQueryDto,
  ): Promise<{ result: Base[]; count: number }> {
    return this.baseService.queryEntity(this.accessoryRepository, query);
  }

  async findOne(id: Accessory['id']) {
    const result = await this.accessoryRepository.findOneBy({ id });
    if (!result) {
      throw new NotFound('accessory_not_found');
    }
    return result;
  }

  async update(
    id: Accessory['id'],
    updateAccessoryDto: UpdateAccessoryDto,
  ): Promise<Accessory> {
    const existingAccessory: Accessory = await this.findOne(id);

    Object.assign(existingAccessory, updateAccessoryDto);
    return this.accessoryRepository.save(existingAccessory);
  }

  async delete(id: Accessory['id']): Promise<Accessory> {
    const accessory = await this.findOne(id);
    return this.accessoryRepository.softRemove(accessory);
  }
}
