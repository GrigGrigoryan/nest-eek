import { registerAs } from '@nestjs/config';
import { LinodeConfig } from './config.type';
import validateConfig from 'src/utils/validate-config';
import { IsString } from 'class-validator';

class EnvironmentVariablesValidator {
  @IsString()
  LINODE_REGION: string;
  @IsString()
  LINODE_ACCESS_KEY_ID: string;
  @IsString()
  LINODE_SECRET_ACCESS_KEY: string;
  @IsString()
  LINODE_CLUSTER_ID: string;
  @IsString()
  LINODE_BUCKET: string;
}

export default registerAs<LinodeConfig>('linode', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    region: process.env.LINODE_REGION,
    accessKeyId: process.env.LINODE_ACCESS_KEY_ID,
    secretAccessKey: process.env.LINODE_SECRET_ACCESS_KEY,
    endpoint: `https://${process.env.LINODE_CLUSTER_ID}.linodeobjects.com`,
    bucket: process.env.LINODE_BUCKET,
  };
});
