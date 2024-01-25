import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFound } from '../../../errors/NotFound';
import { MaterialType } from '../entities/material-type.entity';

@Injectable()
export class MaterialTypeService {
  constructor(
    @InjectRepository(MaterialType)
    private readonly materialTypeRepository: Repository<MaterialType>,
  ) {}

  async count(): Promise<number> {
    return this.materialTypeRepository.count();
  }

  async findOne(id: MaterialType['id']) {
    const result = await this.materialTypeRepository.findOneBy({ id });
    if (!result) {
      throw new NotFound('material_type_not_found');
    }
    return result;
  }

  async bulkCreate(materialTypes: MaterialType[]): Promise<void> {
    await this.materialTypeRepository
      .createQueryBuilder()
      .insert()
      .into(MaterialType)
      .values(materialTypes)
      .execute();
  }
}
