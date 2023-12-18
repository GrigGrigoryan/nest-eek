import { Injectable } from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { ListMaterialQueryDto } from './dto/list-material.query.dto';
import { Base } from '../base/base.entity';
import { NotFound } from '../../errors/NotFound';
import { Material } from './entities/material.entity';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    private readonly baseService: BaseService,
  ) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    return this.materialRepository.save(
      this.materialRepository.create(createMaterialDto),
    );
  }

  listMaterials(
    query: ListMaterialQueryDto,
  ): Promise<{ result: Base[]; count: number }> {
    return this.baseService.queryEntity(this.materialRepository, query);
  }

  async findOne(id: Material['id']) {
    const result = await this.materialRepository.findOneBy({ id });
    if (!result) {
      throw new NotFound('material_not_found');
    }
    return result;
  }

  async update(
    id: Material['id'],
    updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    const existingMaterial: Material = await this.findOne(id);

    Object.assign(existingMaterial, updateMaterialDto);
    return this.materialRepository.save(existingMaterial);
  }

  async delete(id: Material['id']): Promise<Material> {
    const material = await this.findOne(id);
    return this.materialRepository.softRemove(material);
  }
}
