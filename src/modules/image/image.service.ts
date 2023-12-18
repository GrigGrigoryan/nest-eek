import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { Base } from '../base/base.entity';
import { NotFound } from '../../errors/NotFound';
import { Image } from './image.entity';
import { ListImageQueryDto } from './dto/list-image.query.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly baseService: BaseService,
  ) {}

  async create(createImageDto: CreateImageDto): Promise<Image> {
    return this.imageRepository.save(
      this.imageRepository.create(createImageDto),
    );
  }

  listImages(
    query: ListImageQueryDto,
  ): Promise<{ result: Base[]; count: number }> {
    return this.baseService.queryEntity(this.imageRepository, query);
  }

  async findOne(id: Image['id']) {
    const result = await this.imageRepository.findOneBy({ id });
    if (!result) {
      throw new NotFound('image_not_found');
    }
    return result;
  }

  async update(
    id: Image['id'],
    updateImageDto: UpdateImageDto,
  ): Promise<Image> {
    const existingImage: Image = await this.findOne(id);

    Object.assign(existingImage, updateImageDto);
    return this.imageRepository.save(existingImage);
  }

  async delete(id: Image['id']): Promise<Image> {
    const image = await this.findOne(id);
    return this.imageRepository.softRemove(image);
  }
}
