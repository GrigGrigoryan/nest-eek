import {
  HttpStatus,
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { NodeEnv } from 'src/utils/enums/node-env.enum';
import { ConfigService } from '@nestjs/config';
import { ThrottlerException } from '@nestjs/throttler';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly configService: ConfigService) {}

  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let errorResponse: any = {};

    if (typeof error === 'string') {
      errorResponse.message = error;
    } else if (error instanceof ThrottlerException) {
      errorResponse.status = error['status'];
      errorResponse.message = error.message;
    } else if (error instanceof HttpException) {
      errorResponse = error.getResponse();
      errorResponse.status = error.getStatus();
      // at some point` useless, but can be handy.
      //
      // } else if (error instanceof TypeORMError) {
      //   errorResponse.status = HttpStatus.BAD_REQUEST;
      //   errorResponse.stack = error.stack;
      //   errorResponse.message = error.message;
    } else if (error instanceof QueryFailedError) {
      errorResponse.status = HttpStatus.BAD_REQUEST;
      errorResponse.stack = error.stack;
      errorResponse.message =
        'Database query failed. Please check your request.';
    } else {
      errorResponse.stack = error.stack;
      errorResponse.message = error.message;
    }

    this.sendErrorResponse(errorResponse, response);
  }
  private sendErrorResponse(errorResponse: any, res: Response) {
    this.logger.error(JSON.stringify(errorResponse));
    const status = errorResponse.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const response: any = {
      message: errorResponse.message,
      description: errorResponse.description,
    };

    const currentEnv = this.configService.get('app.nodeEnv') as NodeEnv;

    if (currentEnv === NodeEnv.LOCAL || currentEnv === NodeEnv.DEV) {
      response.stack = errorResponse.stack;
    }
    if (
      errorResponse.isOperational === false ||
      ((currentEnv === NodeEnv.PROD || currentEnv === NodeEnv.STAGE) &&
        status === HttpStatus.INTERNAL_SERVER_ERROR)
    ) {
      this.logger.error(response.message, errorResponse?.stack);
      response.message = 'Something went wrong. Please contact us';
    }

    res.status(status).send(response);
  }
}
