import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ShoesService } from './shoes.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RoleGuard } from '../role/role.guard';
import { CreateShoesDto } from './dto/create-shoes.dto';
import { UpdateShoesDto } from './dto/update-shoes.dto';
import { Throttle } from '@nestjs/throttler';
import { ParamUUID } from '../../decorators/ParamUUID';
import { ListShoesQueryDto } from './dto/list-shoes.query.dto';

@ApiBearerAuth()
@ApiTags('Shoes')
@UseGuards(JwtAccessGuard, RoleGuard)
@Controller({
  path: 'shoes',
})
export class ShoesController {
  constructor(private readonly shoesService: ShoesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createShoesDto: CreateShoesDto) {
    return this.shoesService.create(createShoesDto);
  }

  @Throttle(30, 60)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query(new ValidationPipe()) query: ListShoesQueryDto) {
    return this.shoesService.listShoes(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@ParamUUID('id') id: string) {
    return this.shoesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@ParamUUID('id') id: string, @Body() updateShoesDto: UpdateShoesDto) {
    return this.shoesService.update(id, updateShoesDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@ParamUUID('id') id: string) {
    return this.shoesService.delete(id);
  }
}
