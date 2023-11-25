import { Injectable } from '@nestjs/common';
import { CreateShoesDto } from './dto/create-shoes.dto';
import { UpdateShoesDto } from './dto/update-shoes.dto';

@Injectable()
export class ShoesService {
  create(createShoesDto: CreateShoesDto) {
    return 'This action adds a new shoes';
  }

  findAll() {
    return `This action returns all shoes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shoes`;
  }

  update(id: number, updateShoesDto: UpdateShoesDto) {
    return `This action updates a #${id} shoes`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoes`;
  }
}
