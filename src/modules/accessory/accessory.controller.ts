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
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RoleGuard } from '../role/role.guard';
import { AccessoryService } from './accessory.service';
import { Throttle } from '@nestjs/throttler';
import { ParamUUID } from '../../decorators/ParamUUID';
import { ListAccessoryQueryDto } from './dto/list-accessory.query.dto';

@ApiBearerAuth()
@ApiTags('Accessory')
@UseGuards(JwtAccessGuard, RoleGuard)
@Controller({
  path: 'accessory',
})
export class AccessoryController {
  constructor(private readonly accessoryService: AccessoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAccessoryDto: CreateAccessoryDto) {
    return this.accessoryService.create(createAccessoryDto);
  }

  @Throttle(30, 60)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query(new ValidationPipe()) query: ListAccessoryQueryDto) {
    return this.accessoryService.listAccessories(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@ParamUUID('id') id: string) {
    return this.accessoryService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @ParamUUID('id') id: string,
    @Body() updateAccessoryDto: UpdateAccessoryDto,
  ) {
    return this.accessoryService.update(id, updateAccessoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@ParamUUID('id') id: string) {
    return this.accessoryService.delete(id);
  }
}
