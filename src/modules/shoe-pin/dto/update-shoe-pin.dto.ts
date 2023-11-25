import { PartialType } from '@nestjs/swagger';
import { CreateShoePinDto } from './create-shoe-pin.dto';

export class UpdateShoePinDto extends PartialType(CreateShoePinDto) {}
