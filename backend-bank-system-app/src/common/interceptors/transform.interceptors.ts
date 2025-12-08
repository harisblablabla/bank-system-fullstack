/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponseDto } from '../dto/response.dto';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  SuccessResponseDto<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already wrapped in SuccessResponseDto, return as is
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (data && data.success !== undefined) {
          return data;
        }

        return new SuccessResponseDto(data);
      }),
    );
  }
}
