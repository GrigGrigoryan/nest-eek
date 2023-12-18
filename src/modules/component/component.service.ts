import { Injectable } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { NotFound } from '../../errors/NotFound';
import { Component } from './entities/component.entity';
import { Base } from '../base/base.entity';
import { ListComponentQueryDto } from './dto/list-component.query.dto';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
    private readonly baseService: BaseService,
  ) {}

  async create(createComponentDto: CreateComponentDto): Promise<Component> {
    return this.componentRepository.save(
      this.componentRepository.create(createComponentDto),
    );
  }

  listComponents(
    query: ListComponentQueryDto,
  ): Promise<{ result: Base[]; count: number }> {
    return this.baseService.queryEntity(this.componentRepository, query);
  }

  async findOne(id: Component['id']) {
    const result = await this.componentRepository.findOneBy({ id });
    if (!result) {
      throw new NotFound('component_not_found');
    }
    return result;
  }

  async update(
    id: Component['id'],
    updateComponentDto: UpdateComponentDto,
  ): Promise<Component> {
    const existingComponent: Component = await this.findOne(id);

    Object.assign(existingComponent, updateComponentDto);
    return this.componentRepository.save(existingComponent);
  }

  async delete(id: Component['id']): Promise<Component> {
    const component = await this.findOne(id);
    return this.componentRepository.softRemove(component);
  }
}
