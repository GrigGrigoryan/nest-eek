import { IsArray, IsUUID } from 'class-validator';
import { ComponentType } from '../../component/entities/component-type.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModelDto {
  @ApiProperty({ example: [''] })
  @IsArray()
  @IsUUID(4, {
    each: true,
    message: 'Each item in the array must be uuid.',
  })
  componentsIds: ComponentType['id'][];
}
