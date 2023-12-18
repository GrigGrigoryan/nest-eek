import { Module } from '@nestjs/common';
import { ShoesService } from './shoes.service';
import { ShoesController } from './shoes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shoes } from './shoes.entity';
import { BaseService } from '../base/base.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shoes])],
  controllers: [ShoesController],
  providers: [ShoesService, BaseService],
})
export class ShoesModule {}
