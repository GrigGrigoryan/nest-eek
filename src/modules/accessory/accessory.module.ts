import { Module } from '@nestjs/common';
import { AccessoryController } from './accessory.controller';
import { AccessoryService } from './accessory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accessory } from './accessory.entity';
import { BaseService } from '../base/base.service';

@Module({
  imports: [TypeOrmModule.forFeature([Accessory])],
  controllers: [AccessoryController],
  providers: [AccessoryService, BaseService],
})
export class AccessoryModule {}
