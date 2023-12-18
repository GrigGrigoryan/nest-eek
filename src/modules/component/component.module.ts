import { Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './entities/component.entity';
import { BaseService } from '../base/base.service';

@Module({
  imports: [TypeOrmModule.forFeature([Component])],
  controllers: [ComponentController],
  providers: [ComponentService, BaseService],
})
export class ComponentModule {}
