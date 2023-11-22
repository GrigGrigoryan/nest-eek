import { BaseQueryDto } from '../../base/dto/base-query.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Role } from '../../role/role.entity';

export class QueryUserDto extends PartialType(BaseQueryDto) {
  @ApiProperty({ required: false })
  rolesToExclude: Role['name'][];

  @ApiProperty({ required: false })
  rolesToInclude: Role['name'][];
}
