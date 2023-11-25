import { Injectable } from '@nestjs/common';
import { CreateShoeDto } from './dto/create-shoe.dto';
import { UpdateShoeDto } from './dto/update-shoe.dto';

@Injectable()
export class ShoeService {
  create(createShoeDto: CreateShoeDto) {
    return 'This action adds a new shoe';
  }

  findAll() {
    return `This action returns all shoe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shoe`;
  }

  update(id: number, updateShoeDto: UpdateShoeDto) {
    return `This action updates a #${id} shoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoe`;
  }
}
