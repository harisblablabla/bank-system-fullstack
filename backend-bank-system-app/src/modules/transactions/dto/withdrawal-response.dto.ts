import { ApiProperty } from '@nestjs/swagger';
import { TransactionResponseDto } from './transaction-response.dto';

export class WithdrawalResponseDto extends TransactionResponseDto {
  @ApiProperty({
    example: 1515000.0,
    description:
      'Final balance after withdrawal including interest calculation',
  })
  endingBalance: number;

  @ApiProperty({
    example:
      'Successfully withdrawn 500000.00 with 15000.00 interest earned over 6 months',
    description: 'Human-readable summary of the withdrawal',
  })
  summary: string;
}
