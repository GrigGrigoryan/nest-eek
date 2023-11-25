import { Module } from '@nestjs/common';
import { ShoeService } from './shoe.service';
import { ShoeController } from './shoe.controller';

@Module({
  controllers: [ShoeController],
  providers: [ShoeService],
})
export class ShoeModule {}
