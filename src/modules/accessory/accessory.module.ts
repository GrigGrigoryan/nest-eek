import { Module } from '@nestjs/common';
import { AccessoryController } from './accessory.controller';
import { AccessoryService } from './accessory.service';

@Module({
  controllers: [AccessoryController],
  providers: [AccessoryService],
})
export class AccessoryModule {}
