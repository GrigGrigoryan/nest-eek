import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { PaymentConfig } from './config.type';

class EnvironmentVariablesValidator {
  @IsString()
  PAYMENT_CLIENT_ID: string;

  @IsString()
  PAYMENT_USERNAME: string;

  @IsString()
  PAYMENT_PASSWORD: string;

  @IsString()
  PAYMENT_DOMAIN: string;

  @IsString()
  PAYMENT_API_URI: string;

  @IsString()
  PAYMENT_PAY_URI: string;

  @IsString()
  PAYMENT_PROVIDER_ORDER_ID_MIN: string;

  @IsString()
  PAYMENT_PROVIDER_ORDER_ID_MAX: string;
}

export default registerAs<PaymentConfig>('payment', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    clientId: process.env.PAYMENT_CLIENT_ID,
    username: process.env.PAYMENT_USERNAME,
    password: process.env.PAYMENT_PASSWORD,
    apiUrl: `${process.env.PAYMENT_DOMAIN}/${process.env.PAYMENT_API_URI}`,
    paymentUrl: `${process.env.PAYMENT_DOMAIN}/${process.env.PAYMENT_PAY_URI}`,
    redirectUrl: `${process.env.FRONTEND_DOMAIN}/${process.env.PAYMENT_REDIRECT_URI}`,
    providerOrderIdRange: [
      Number(process.env.PAYMENT_PROVIDER_ORDER_ID_MIN),
      Number(process.env.PAYMENT_PROVIDER_ORDER_ID_MAX),
    ],
  };
});
