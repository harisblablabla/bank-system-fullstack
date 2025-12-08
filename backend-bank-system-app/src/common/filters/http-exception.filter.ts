import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseDto } from '../dto/response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: ErrorResponseDto;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        let message: string;
        if (Array.isArray(exceptionResponse['message'])) {
          message = exceptionResponse['message'].join(', ');
        } else if (typeof exceptionResponse['message'] === 'string') {
          message = exceptionResponse['message'];
        } else {
          message = 'An unknown validation error occurred.';
        }

        errorResponse = new ErrorResponseDto(
          'VALIDATION_ERROR',
          message,
          Array.isArray(exceptionResponse['message'])
            ? exceptionResponse['message']
            : undefined,
        );
      } else {
        errorResponse = new ErrorResponseDto(
          'HTTP_EXCEPTION',
          exception.message,
        );
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled error: ${exception.message}`,
        exception.stack,
      );
      errorResponse = new ErrorResponseDto(
        'INTERNAL_SERVER_ERROR',
        process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : exception.message,
      );
    } else {
      this.logger.error('Unknown exception type', exception);
      errorResponse = new ErrorResponseDto(
        'UNKNOWN_ERROR',
        'An unknown error occurred',
      );
    }

    this.logger.error(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      `${request.method} ${request.url} - Status: ${status}`,
      JSON.stringify(errorResponse),
    );

    response.status(status).json(errorResponse);
  }
}
