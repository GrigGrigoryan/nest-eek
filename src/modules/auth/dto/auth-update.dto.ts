import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class AuthUpdateDto {
  // @ApiProperty({ example: 'johnnie' })
  // @IsOptional()
  // @MinLength(3)
  // @IsString()
  // @Validate(IsNotExist, ['User'], {
  //   message: 'username_already_exist',
  // })
  // username?: string;

  // @ApiProperty({ example: '+37499887766' })
  // @Validate(IsNotExist, ['User'], {
  //   message: 'phone_already_exists',
  // })
  // @IsOptional()
  // @IsString()
  // phone?: string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  @MinLength(3)
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @MinLength(3)
  @IsString()
  lastName?: string;
}
