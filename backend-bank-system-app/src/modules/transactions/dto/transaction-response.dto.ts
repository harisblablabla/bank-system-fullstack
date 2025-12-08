import { ApiProperty } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty({
    example: '770e8400-e29b-41d4-a716-446655440002',
    description: 'Transaction ID',
  })
  id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Account ID',
  })
  accountId: string;

  @ApiProperty({
    example: 'DEPOSIT',
    description: 'Transaction type',
    enum: ['DEPOSIT', 'WITHDRAWAL'],
  })
  type: string;

  @ApiProperty({
    example: 1000000.0,
    description: 'Transaction amount',
  })
  amount: number;

  @ApiProperty({
    example: '2024-12-08T10:30:00.000Z',
    description: 'When the transaction occurred',
  })
  transactionDate: Date;

  @ApiProperty({
    example: 500000.0,
    description: 'Account balance before transaction',
  })
  balanceBefore: number;

  @ApiProperty({
    example: 1500000.0,
    description: 'Account balance after transaction',
  })
  balanceAfter: number;

  @ApiProperty({
    example: 6,
    description: 'Number of months money was held (for withdrawals)',
  })
  monthsHeld: number;

  @ApiProperty({
    example: 15000.0,
    description: 'Interest earned (for withdrawals)',
  })
  interestEarned: number;

  @ApiProperty({
    example: '2024-12-08T10:30:05.000Z',
    description: 'When this record was created',
  })
  createdAt: Date;
}
