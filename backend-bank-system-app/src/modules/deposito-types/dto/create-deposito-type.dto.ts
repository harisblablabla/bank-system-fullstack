// create-deposito-type.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDepositoTypeDto {
  @ApiProperty({
    example: 'Deposito Platinum',
    description: 'Deposito type name',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiProperty({
    example: 8.5,
    description: 'Yearly return percentage (0-100)',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber({}, { message: 'Yearly return must be a number' })
  @Type(() => Number)
  @Min(0, { message: 'Yearly return must be at least 0' })
  @Max(100, { message: 'Yearly return must not exceed 100' })
  yearlyReturn: number;
}
