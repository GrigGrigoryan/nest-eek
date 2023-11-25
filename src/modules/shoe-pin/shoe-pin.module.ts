import { Module } from '@nestjs/common';
import { ShoePinService } from './shoe-pin.service';
import { ShoePinController } from './shoe-pin.controller';

@Module({
  controllers: [ShoePinController],
  providers: [ShoePinService],
})
export class ShoePinModule {}
