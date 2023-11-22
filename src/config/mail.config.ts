import { registerAs } from '@nestjs/config';
import { MailConfig } from './config.type';
import { IsString, IsEmail } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  SENDGRID_API_KEY: string;

  @IsEmail()
  SENDGRID_FROM_MAIL: string;
}

export default registerAs<MailConfig>('mail', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiKey: process.env.SENDGRID_API_KEY,
    from: process.env.SENDGRID_FROM_MAIL,
  };
});
