import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NodeEnv } from 'src/utils/enums/node-env.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const currentEnv =
      this.configService.get('app.nodeEnv') || (NodeEnv.LOCAL as NodeEnv);

    return next.handle().pipe(
      map((data) => {
        if (currentEnv === NodeEnv.PROD) {
          return this.mapForProduction(data);
        } else if (currentEnv === NodeEnv.DEV) {
          return this.mapForDevelopment(data);
        } else if (currentEnv === NodeEnv.STAGE) {
          return this.mapForStaging(data);
        } else if (currentEnv === NodeEnv.LOCAL) {
          return this.mapForLocal(data);
        }

        // Default mapping if no condition is satisfied
        return this.defaultMap(data);
      }),
    );
  }

  private mapForProduction(data: any): any {
    // Apply mapping logic for production environment
    // Return the transformed data
    return data;
  }

  private mapForDevelopment(data: any): any {
    // Apply mapping logic for development environment
    // Return the transformed data
    return data;
  }

  private mapForStaging(data: any): any {
    // Apply mapping logic for staging environment
    // Return the transformed data
    return data;
  }

  private mapForLocal(data: any): any {
    // Apply mapping logic for local environment
    // Return the transformed data
    return data;
  }

  private defaultMap(data: any): any {
    // Apply a default mapping logic if no environment condition is satisfied
    // Return the transformed data
    return data;
  }
}
