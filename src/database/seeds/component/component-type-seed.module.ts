import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseService } from '../../../modules/base/base.service';
import { ComponentTypeSeedService } from './component-type-seed.service';
import { ComponentService } from '../../../modules/component/services/component.service';
import { ComponentTypeService } from '../../../modules/component/services/component-type.service';
import { Component } from '../../../modules/component/entities/component.entity';
import { ComponentType } from '../../../modules/component/entities/component-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Component, ComponentType])],
  providers: [
    ComponentTypeSeedService,
    ComponentTypeService,
    ComponentService,
    BaseService,
  ],
  exports: [ComponentTypeSeedService],
})
export class ComponentTypeSeedModule {}
