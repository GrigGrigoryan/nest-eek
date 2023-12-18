import { PartialType } from '@nestjs/swagger';
import { BaseQueryDto } from '../../base/dto/base-query.dto';

export class ListMaterialQueryDto extends PartialType(BaseQueryDto) {}
