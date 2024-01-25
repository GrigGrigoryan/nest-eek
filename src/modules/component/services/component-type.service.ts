import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFound } from '../../../errors/NotFound';
import { ComponentType } from '../entities/component-type.entity';

@Injectable()
export class ComponentTypeService {
  constructor(
    @InjectRepository(ComponentType)
    private readonly componentTypeRepository: Repository<ComponentType>,
  ) {}

  async count(): Promise<number> {
    return this.componentTypeRepository.count();
  }

  async findOne(id: ComponentType['id']) {
    const result = await this.componentTypeRepository.findOneBy({ id });
    if (!result) {
      throw new NotFound('component_type_not_found');
    }
    return result;
  }

  async bulkCreate(componentTypes: ComponentType[]): Promise<void> {
    await this.componentTypeRepository
      .createQueryBuilder()
      .insert()
      .into(ComponentType)
      .values(componentTypes)
      .execute();
  }
}
