import { Module } from '@nestjs/common';
import { MaterialService } from './services/material.service';
import { MaterialController } from './material.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { BaseService } from '../base/base.service';
import { MaterialTypeService } from './services/material-type.service';
import { MaterialType } from './entities/material-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Material, MaterialType])],
  controllers: [MaterialController],
  providers: [MaterialService, MaterialTypeService, BaseService],
})
export class MaterialModule {}
