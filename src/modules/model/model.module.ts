import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';
import { BaseService } from '../base/base.service';

@Module({
  imports: [TypeOrmModule.forFeature([Model])],
  controllers: [ModelController],
  providers: [ModelService, BaseService],
})
export class ModelModule {}
