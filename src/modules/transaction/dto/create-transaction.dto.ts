import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsExist } from '../../../utils/validators/is-exists.validator';
import { User } from '../../user/entities/user.entity';
import { TransactionStatus, TransactionType } from '../transaction.enum';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: TransactionStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: TransactionType;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  details?: string;

  @ApiProperty({ type: User })
  @IsNotEmpty()
  @Validate(IsExist, ['User', 'id'], {
    message: 'user_not_exists',
  })
  user: User;
}
