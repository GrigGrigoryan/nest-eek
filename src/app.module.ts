import { Module, OnModuleInit, Scope } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import appConfig from './config/app.config';
import paymentConfig from './config/payment.config';
import mailConfig from './config/mail.config';
import linodeConfig from './config/linode.config';
import facebookConfig from './config/facebook.config';
import googleConfig from './config/google.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource } from 'typeorm';
import { InternalServerError } from './errors/InternalServerError';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RoleSeedService } from './database/seeds/role/role-seed.service';
import { UserSeedService } from './database/seeds/user/user-seed.service';
import { RoleModule } from './modules/role/role.module';
import { UserSeedModule } from './database/seeds/user/user-seed.module';
import { RoleSeedModule } from './database/seeds/role/role-seed.module';
import { JwtModule } from '@nestjs/jwt';
import { PaymentModule } from './modules/payment/payment.module';
import { MailerModule } from './mailer/mailer.module';
import { LinodeModule } from './linode/linode.module';
import { NotificationTemplateModule } from './modules/notification-template/notification-template.module';
import { NotificationTemplateSeedService } from './database/seeds/notification-template/notification-template-seed.service';
import { NotificationTemplateSeedModule } from './database/seeds/notification-template/notification-template-seed.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ShoeModule } from './modules/shoe/shoe.module';
import { ShoePinModule } from './modules/shoe-pin/shoe-pin.module';
import { CategoryModule } from './modules/category/category.module';
import { CartModule } from './modules/cart/cart.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { ImageModule } from './modules/image/image.module';
import throttlerConfig from './config/throttler.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        throttlerConfig,
        facebookConfig,
        googleConfig,
        paymentConfig,
        mailConfig,
        linodeConfig,
      ],
      envFilePath: ['.env'],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule], // Make sure to import ConfigModule
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<number>('throttle.ttl'), // seconds
        limit: configService.get<number>('throttle.limit'), // requests per TTL period
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new InternalServerError('Invalid options passed');
        }
        return await new DataSource(options).initialize();
      },
    }),
    JwtModule,
    UserModule,
    UserSeedModule,
    AuthModule,
    RoleModule,
    RoleSeedModule,
    PaymentModule,
    MailerModule,
    LinodeModule,
    NotificationTemplateModule,
    NotificationTemplateSeedModule,
    TransactionModule,
    ShoeModule,
    ShoePinModule,
    CategoryModule,
    CartModule,
    CartItemModule,
    ImageModule,
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransformResponseInterceptor,
    // },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly roleSeedService: RoleSeedService,
    private readonly userSeedService: UserSeedService,
    private readonly notificationTemplateSeedService: NotificationTemplateSeedService,
  ) {}

  async onModuleInit() {
    await this.roleSeedService.run();
    await this.userSeedService.run();
    await this.notificationTemplateSeedService.run();
  }
}
