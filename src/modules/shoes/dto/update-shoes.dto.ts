import { PartialType } from '@nestjs/swagger';
import { CreateShoesDto } from './create-shoes.dto';

export class UpdateShoesDto extends PartialType(CreateShoesDto) {}
