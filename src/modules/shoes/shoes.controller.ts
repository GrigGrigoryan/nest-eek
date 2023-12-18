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
import { ShoesService } from './shoes.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RoleGuard } from '../role/role.guard';
import { CreateShoesDto } from './dto/create-shoes.dto';
import { UpdateShoesDto } from './dto/update-shoes.dto';

@ApiBearerAuth()
@ApiTags('Shoes')
@UseGuards(JwtAccessGuard, RoleGuard)
@Controller({
  path: 'shoes',
})
export class ShoesController {
  constructor(private readonly shoesService: ShoesService) {}

  @Post()
  create(@Body() createShoesDto: CreateShoesDto) {
    return this.shoesService.create(createShoesDto);
  }

  @Get()
  findAll() {
    return this.shoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShoesDto: UpdateShoesDto) {
    return this.shoesService.update(+id, updateShoesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoesService.remove(+id);
  }
}
