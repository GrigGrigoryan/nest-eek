import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CancelPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderId: string;
}

export class CancelPaymentRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  PaymentId: string;
}

export class CancelPaymentResponseDto {
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
