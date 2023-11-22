import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleEnum } from '../role/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { QueryUserDto } from './dto/list-user.dto';
import { ParamUUID } from '../../decorators/ParamUUID';
import { Throttle } from '@nestjs/throttler';

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtAccessGuard, RoleGuard)
@Controller({
  path: 'user',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Throttle(30, 60)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.ADMIN)
  @Get('client')
  @HttpCode(HttpStatus.OK)
  async findAllClients(@Query(new ValidationPipe()) query: QueryUserDto) {
    return this.userService.listClients(query);
  }

  @Throttle()
  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.ADMIN)
  @Get('admin')
  @HttpCode(HttpStatus.OK)
  async findAllAdmins(@Query(new ValidationPipe()) query: QueryUserDto) {
    return this.userService.listAdmins(query);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.ADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@ParamUUID('id') id: string) {
    return this.userService.getUserBy({ id });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.ADMIN)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@ParamUUID('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@ParamUUID('id') id: string) {
    return this.userService.delete(id);
  }
}
