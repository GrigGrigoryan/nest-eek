import { Injectable } from '@nestjs/common';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { Base } from '../base/base.entity';
import { NotFound } from '../../errors/NotFound';
import { ListModelQueryDto } from './dto/list-model.query.dto';
import { Model } from './entities/model.entity';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private readonly imageRepository: Repository<Model>,
    private readonly baseService: BaseService,
  ) {}

  async create(createModelDto: CreateModelDto): Promise<Model> {
    return this.imageRepository.save(
      this.imageRepository.create(createModelDto),
    );
  }

  listModels(
    query: ListModelQueryDto,
  ): Promise<{ result: Base[]; count: number }> {
    return this.baseService.queryEntity(this.imageRepository, query);
  }

  async findOne(id: Model['id']) {
    const result = await this.imageRepository.findOneBy({ id });
    if (!result) {
      throw new NotFound('image_not_found');
    }
    return result;
  }

  async update(
    id: Model['id'],
    updateModelDto: UpdateModelDto,
  ): Promise<Model> {
    const existingModel: Model = await this.findOne(id);

    Object.assign(existingModel, updateModelDto);
    return this.imageRepository.save(existingModel);
  }

  async delete(id: Model['id']): Promise<Model> {
    const image = await this.findOne(id);
    return this.imageRepository.softRemove(image);
  }
}
