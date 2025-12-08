import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty()
  data: T;

  @ApiProperty({ example: 'Operation successful' })
  message: string;

  constructor(data: T, message = 'Operation successful') {
    this.success = true;
    this.data = data;
    this.message = message;
  }
}

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({
    example: {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: [],
    },
  })
  error: {
    code: string;
    message: string;
    details?: any[];
  };

  constructor(code: string, message: string, details?: any[]) {
    this.success = false;
    this.error = {
      code,
      message,
      details,
    };
  }
}
