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
import { ModelService } from './model.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RoleGuard } from '../role/role.guard';
import { Throttle } from '@nestjs/throttler';
import { ParamUUID } from '../../decorators/ParamUUID';
import { ListModelQueryDto } from './dto/list-model.query.dto';

@ApiBearerAuth()
@ApiTags('Model')
@UseGuards(JwtAccessGuard, RoleGuard)
@Controller({
  path: 'model',
})
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createModelDto: CreateModelDto) {
    return this.modelService.create(createModelDto);
  }

  @Throttle(30, 60)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query(new ValidationPipe()) query: ListModelQueryDto) {
    return this.modelService.listModels(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@ParamUUID('id') id: string) {
    return this.modelService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@ParamUUID('id') id: string, @Body() updateModelDto: UpdateModelDto) {
    return this.modelService.update(id, updateModelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@ParamUUID('id') id: string) {
    return this.modelService.delete(id);
  }
}
