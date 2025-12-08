// deposit.dto.ts
import {
  IsUUID,
  IsNotEmpty,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DepositDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Account UUID',
  })
  @IsUUID('4', { message: 'Account ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Account ID is required' })
  accountId: string;

  @ApiProperty({
    example: 1000000.0,
    description: 'Deposit amount',
    minimum: 0.01,
  })
  @IsNumber({}, { message: 'Amount must be a number' })
  @Type(() => Number)
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @ApiProperty({
    example: '2024-12-08T10:30:00.000Z',
    description: 'Transaction date (ISO 8601 format)',
  })
  @IsDateString(
    {},
    { message: 'Transaction date must be a valid ISO 8601 date' },
  )
  @IsNotEmpty({ message: 'Transaction date is required' })
  transactionDate: string;
}
