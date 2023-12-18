import { Injectable } from '@nestjs/common';
import { CreateShoesDto } from './dto/create-shoes.dto';
import { UpdateShoesDto } from './dto/update-shoes.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { Base } from '../base/base.entity';
import { NotFound } from '../../errors/NotFound';
import { Shoes } from './shoes.entity';
import { ListShoesQueryDto } from './dto/list-shoes.query.dto';

@Injectable()
export class ShoesService {
  constructor(
    @InjectRepository(Shoes)
    private readonly imageRepository: Repository<Shoes>,
    private readonly baseService: BaseService,
  ) {}

  async create(createShoesDto: CreateShoesDto): Promise<Shoes> {
    return this.imageRepository.save(
      this.imageRepository.create(createShoesDto),
    );
  }

  listShoes(
    query: ListShoesQueryDto,
  ): Promise<{ result: Base[]; count: number }> {
    return this.baseService.queryEntity(this.imageRepository, query);
  }

  async findOne(id: Shoes['id']) {
    const result = await this.imageRepository.findOneBy({ id });
    if (!result) {
      throw new NotFound('image_not_found');
    }
    return result;
  }

  async update(
    id: Shoes['id'],
    updateShoesDto: UpdateShoesDto,
  ): Promise<Shoes> {
    const existingShoes: Shoes = await this.findOne(id);

    Object.assign(existingShoes, updateShoesDto);
    return this.imageRepository.save(existingShoes);
  }

  async delete(id: Shoes['id']): Promise<Shoes> {
    const image = await this.findOne(id);
    return this.imageRepository.softRemove(image);
  }
}
