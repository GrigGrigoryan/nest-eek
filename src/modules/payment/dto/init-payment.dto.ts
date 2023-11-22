import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InitPaymentRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  OrderID: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  Amount: number;
}

export class InitPaymentResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  PaymentID: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  ResponseCode: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ResponseMessage: string;
}

export class InitPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  flowStateId: string;
}
