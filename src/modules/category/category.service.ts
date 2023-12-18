import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFound } from '../../errors/NotFound';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.save(
      this.categoryRepository.create(createCategoryDto),
    );
  }

  listCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: Category['id']) {
    const result = await this.categoryRepository.findOneBy({ id });
    if (!result) {
      throw new NotFound('category_not_found');
    }
    return result;
  }

  async update(
    id: Category['id'],
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const existingCategory: Category = await this.findOne(id);

    Object.assign(existingCategory, updateCategoryDto);
    return this.categoryRepository.save(existingCategory);
  }

  async delete(id: Category['id']): Promise<Category> {
    const category = await this.findOne(id);
    return this.categoryRepository.softRemove(category);
  }
}
