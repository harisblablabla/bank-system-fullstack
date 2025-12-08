// create-account.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({
    example: 'Premium Savings Account',
    description: 'Account package name',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Packet name is required' })
  @MinLength(2, { message: 'Packet name must be at least 2 characters' })
  @MaxLength(100, { message: 'Packet name must not exceed 100 characters' })
  packet: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Customer UUID',
  })
  @IsUUID('4', { message: 'Customer ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId: string;

  @ApiProperty({
    example: '660e8400-e29b-41d4-a716-446655440001',
    description: 'Deposito Type UUID',
  })
  @IsUUID('4', { message: 'Deposito Type ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Deposito Type ID is required' })
  depositoTypeId: string;
}
