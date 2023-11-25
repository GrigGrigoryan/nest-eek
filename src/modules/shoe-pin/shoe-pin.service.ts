import { Injectable } from '@nestjs/common';
import { CreateShoePinDto } from './dto/create-shoe-pin.dto';
import { UpdateShoePinDto } from './dto/update-shoe-pin.dto';

@Injectable()
export class ShoePinService {
  create(createShoePinDto: CreateShoePinDto) {
    return 'This action adds a new shoePin';
  }

  findAll() {
    return `This action returns all shoePin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shoePin`;
  }

  update(id: number, updateShoePinDto: UpdateShoePinDto) {
    return `This action updates a #${id} shoePin`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoePin`;
  }
}
