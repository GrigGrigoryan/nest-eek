import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RefundPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class RefundPaymentRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  PaymentId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  Amount: number;
}

export class RefundPaymentResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ResponseCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ResponseMessage: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  Opaque: string;
}
