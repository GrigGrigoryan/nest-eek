import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { BaseService } from '../base/base.service';

@Module({
  imports: [TypeOrmModule.forFeature([Material])],
  controllers: [MaterialController],
  providers: [MaterialService, BaseService],
})
export class MaterialModule {}
