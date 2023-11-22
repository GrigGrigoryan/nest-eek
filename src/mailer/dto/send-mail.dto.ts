import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMailDto {
  @ApiProperty({ example: 'grigor.grigoryan978@gmail.com' })
  @IsString()
  to: string;

  @ApiProperty({ example: 'Sending with Twilio SendGrid is Fun' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'and easy to do anywhere, even with Node.js' })
  @IsString()
  text: string;

  @ApiProperty({
    example: '<strong>and easy to do anywhere, even with Node.js</strong>',
  })
  @IsString()
  html: string;
}
