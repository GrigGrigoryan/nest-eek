import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Redirect,
  Request,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  AuthRegisterDto,
  AuthVerifyRegisterDto,
} from './dto/auth-register.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { ConfigService } from '@nestjs/config';
import { NotificationTemplateService } from '../notification-template/notification-template.service';
import { UserService } from '../user/services/user.service';
import { LoginProvider } from './auth.enum';
import { BadRequest } from '../../errors/BadRequest';
import { User } from '../user/entities/user.entity';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { Roles } from '../role/role.decorator';
import { RoleEnum } from '../role/role.enum';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth-password-reset.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly notificationTemplateService: NotificationTemplateService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async clientLogin(@Body() loginDTO: AuthLoginDto) {
    return this.authService.validateLogin(loginDTO, false);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  public async adminLogin(@Body() loginDTO: AuthLoginDto) {
    return this.authService.validateLogin(loginDTO, true);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() registerDto: AuthRegisterDto) {
    const newUser = await this.authService.register(registerDto);

    return { userVerifyToken: newUser.userVerify?.verifyToken };
  }
  @Post('forgot-password')
  @HttpCode(HttpStatus.CREATED)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const verifyToken = await this.userService.forgotPassword(
      forgotPasswordDto,
    );
    return { verifyToken };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.CREATED)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Post('register/verify')
  @HttpCode(HttpStatus.OK)
  async verifyUserRegister(@Body() verifyRegisterDto: AuthVerifyRegisterDto) {
    const { verifyToken, verifyCode } = verifyRegisterDto;

    const user = await this.userService.getUserByVerifyToken(verifyToken);
    if (user.userVerify?.verifiedDate) {
      throw new BadRequest('user_already_verified');
    }

    if (
      user.userVerify?.verifyCode !== verifyCode ||
      user.userVerify?.verifyToken !== verifyToken
    ) {
      throw new BadRequest('user_verify_not_valid');
    }

    await this.userService.verifyUser(user.userVerify);
    return { message: 'User Verified Successfully, Please Log in.' };
  }

  @ApiBearerAuth()
  @Get('refresh-access')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.CREATED)
  async refreshAccessToken(@Request() { user }: { user: User }) {
    return this.authService.generateTokens(user, false);
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @UseGuards(JwtAccessGuard)
  @Roles(RoleEnum.CLIENT)
  @HttpCode(HttpStatus.OK)
  public async me(@Request() { user }: { user: User }) {
    return this.authService.me(user.id);
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @UseGuards(JwtAccessGuard)
  @Roles(RoleEnum.CLIENT)
  @HttpCode(HttpStatus.OK)
  public async update(
    @Request() { user }: { user: User },
    @Body() userDto: AuthUpdateDto,
  ) {
    return this.authService.update(user.id, userDto);
  }

  @ApiBearerAuth()
  @Delete('me')
  @UseGuards(JwtAccessGuard)
  @Roles(RoleEnum.CLIENT)
  @HttpCode(HttpStatus.OK)
  public async delete(@Request() { user }: { user: User }) {
    return this.authService.delete(user.id);
  }

  @Get('google')
  @UseGuards(AuthGuard(LoginProvider.GOOGLE))
  googleLogin() {
    return HttpStatus.OK;
  }

  @Get('google/callback')
  @Redirect()
  @UseGuards(AuthGuard(LoginProvider.GOOGLE))
  async googleLoginCallback(@Request() { user }: { user: User }) {
    const { accessToken } = this.authService.generateTokens(user, false);

    const url = `${this.configService.get<string>(
      'auth.loginRedirectUrl',
    )}?token=${accessToken}`;

    return { url };
  }

  @Get('facebook')
  @UseGuards(AuthGuard(LoginProvider.FACEBOOK))
  facebookLogin() {
    return HttpStatus.OK;
  }

  @Get('facebook/callback')
  @Redirect()
  @UseGuards(AuthGuard(LoginProvider.FACEBOOK))
  async facebookLoginCallback(@Request() { user }: { user: User }) {
    const { accessToken } = this.authService.generateTokens(user, false);

    const url = `${this.configService.get<string>(
      'auth.loginRedirectUrl',
    )}?token=${accessToken}`;

    return { url };
  }
}
