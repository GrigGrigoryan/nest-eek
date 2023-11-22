import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { LoginProvider } from '../auth.enum';

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  Strategy,
  LoginProvider.FACEBOOK,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('facebook.clientId'),
      clientSecret: configService.get<string>('facebook.clientSecret'),
      callbackURL: configService.get<string>('facebook.redirectURI'),
      authorizationURL: 'https://www.facebook.com/dialog/oauth', // Dummy authorization URL
      tokenURL: 'https://graph.facebook.com/v17.0/oauth/access_token', // Dummy token URL
      profileFields: ['email', 'name'], // fields you want to retrieve
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return this.authService.validateOAuthLogin(profile, LoginProvider.FACEBOOK);
  }
}
