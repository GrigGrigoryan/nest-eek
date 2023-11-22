import { registerAs } from '@nestjs/config';
import { FacebookConfig } from './config.type';
import { IsOptional, IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  FACEBOOK_CLIENT_ID: string;

  @IsString()
  @IsOptional()
  FACEBOOK_CLIENT_SECRET: string;
}

export default registerAs<FacebookConfig>('facebook', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  };
});
