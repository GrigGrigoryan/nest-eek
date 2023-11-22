import { registerAs } from '@nestjs/config';
import { IsInt } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { ThrottleConfig } from './config.type';

class EnvironmentVariablesValidator {
  @IsInt()
  THROTTLE_LIMIT: number;

  @IsInt()
  THROTTLE_TTL: number;
}

export default registerAs<ThrottleConfig>('throttle', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    limit: Number(process.env.THROTTLE_LIMIT) || 10,
    ttl: Number(process.env.THROTTLE_TTL) || 60,
  };
});
