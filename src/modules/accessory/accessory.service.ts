import { Injectable } from '@nestjs/common';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';

@Injectable()
export class AccessoryService {
  create(createAccessoryDto: CreateAccessoryDto) {
    return 'This action adds a new shoesPin';
  }

  findAll() {
    return `This action returns all shoesPin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shoesPin`;
  }

  update(id: number, updateAccessoryDto: UpdateAccessoryDto) {
    return `This action updates a #${id} shoesPin`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoesPin`;
  }
}
