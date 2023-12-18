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
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RoleGuard } from '../role/role.guard';
import { Throttle } from '@nestjs/throttler';
import { ParamUUID } from '../../decorators/ParamUUID';
import { ListImageQueryDto } from './dto/list-image.query.dto';

@ApiBearerAuth()
@ApiTags('Image')
@UseGuards(JwtAccessGuard, RoleGuard)
@Controller({
  path: 'image',
})
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  @Throttle(30, 60)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query(new ValidationPipe()) query: ListImageQueryDto) {
    return this.imageService.listImages(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@ParamUUID('id') id: string) {
    return this.imageService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@ParamUUID('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(id, updateImageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@ParamUUID('id') id: string) {
    return this.imageService.delete(id);
  }
}
