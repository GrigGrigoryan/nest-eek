import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseService } from '../../../modules/base/base.service';
import { MaterialService } from '../../../modules/material/services/material.service';
import { Material } from '../../../modules/material/entities/material.entity';
import { MaterialTypeSeedService } from './material-type-seed.service';
import { MaterialType } from '../../../modules/material/entities/material-type.entity';
import { MaterialTypeService } from '../../../modules/material/services/material-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([Material, MaterialType])],
  providers: [
    MaterialTypeSeedService,
    MaterialTypeService,
    MaterialService,
    BaseService,
  ],
  exports: [MaterialTypeSeedService],
})
export class MaterialTypeSeedModule {}
