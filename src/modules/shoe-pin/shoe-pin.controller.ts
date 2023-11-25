import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ShoePinService } from './shoe-pin.service';
import { CreateShoePinDto } from './dto/create-shoe-pin.dto';
import { UpdateShoePinDto } from './dto/update-shoe-pin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RoleGuard } from '../role/role.guard';

@ApiBearerAuth()
@ApiTags('Shoe Pin')
@UseGuards(JwtAccessGuard, RoleGuard)
@Controller({
  path: 'shoe-pin',
})
export class ShoePinController {
  constructor(private readonly shoePinService: ShoePinService) {}

  @Post()
  create(@Body() createShoePinDto: CreateShoePinDto) {
    return this.shoePinService.create(createShoePinDto);
  }

  @Get()
  findAll() {
    return this.shoePinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoePinService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShoePinDto: UpdateShoePinDto) {
    return this.shoePinService.update(+id, updateShoePinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoePinService.remove(+id);
  }
}
