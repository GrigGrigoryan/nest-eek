import { BaseQueryDto } from '../../base/dto/base-query.dto';
import { PartialType } from '@nestjs/swagger';

export class QueryTransactionDto extends PartialType(BaseQueryDto) {}
