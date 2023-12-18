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
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RoleGuard } from '../role/role.guard';
import { Throttle } from '@nestjs/throttler';
import { ParamUUID } from '../../decorators/ParamUUID';
import { ListMaterialQueryDto } from './dto/list-material.query.dto';

@Controller('material')
@ApiBearerAuth()
@ApiTags('Material')
@UseGuards(JwtAccessGuard, RoleGuard)
@Controller({
  path: 'material',
})
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialService.create(createMaterialDto);
  }

  @Throttle(30, 60)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query(new ValidationPipe()) query: ListMaterialQueryDto) {
    return this.materialService.listMaterials(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@ParamUUID('id') id: string) {
    return this.materialService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @ParamUUID('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.materialService.update(id, updateMaterialDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@ParamUUID('id') id: string) {
    return this.materialService.delete(id);
  }
}
