import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { WithdrawalResponseDto } from './dto/withdrawal-response.dto';
import { Transaction } from './entities/transaction.entity';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Deposit money to account',
    description:
      'Adds money to an account balance. Records the transaction with date.',
  })
  @ApiBody({ type: DepositDto })
  @ApiResponse({
    status: 201,
    description: 'Deposit successful',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  async deposit(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    depositDto: DepositDto,
  ): Promise<Transaction> {
    return this.transactionsService.deposit(depositDto);
  }

  @Post('withdraw')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Withdraw money from account',
    description:
      'Withdraws money from account with automatic interest calculation based on deposit date and deposito type. Formula: ending_balance = starting_balance * (1 + monthly_return)^months',
  })
  @ApiBody({ type: WithdrawDto })
  @ApiResponse({
    status: 201,
    description: 'Withdrawal successful with interest calculation',
    type: WithdrawalResponseDto,
    schema: {
      example: {
        id: '880e8400-e29b-41d4-a716-446655440003',
        accountId: '770e8400-e29b-41d4-a716-446655440002',
        type: 'WITHDRAWAL',
        amount: 500000.0,
        transactionDate: '2024-12-08T10:30:00.000Z',
        balanceBefore: 1000000.0,
        balanceAfter: 515000.0,
        monthsHeld: 6,
        interestEarned: 15000.0,
        endingBalance: 1015000.0,
        summary:
          'Successfully withdrawn 500000.00 with 15000.00 interest earned over 6 months',
        createdAt: '2024-12-08T10:30:05.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - insufficient balance or validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  async withdraw(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    withdrawDto: WithdrawDto,
  ): Promise<WithdrawalResponseDto> {
    return this.transactionsService.withdraw(withdrawDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all transactions',
    description: 'Retrieves all transactions with optional account filter',
  })
  @ApiQuery({
    name: 'accountId',
    required: false,
    description: 'Filter transactions by account UUID',
    example: '770e8400-e29b-41d4-a716-446655440002',
  })
  @ApiResponse({
    status: 200,
    description: 'List of transactions ordered by date (newest first)',
    type: [TransactionResponseDto],
  })
  async findAll(
    @Query('accountId') accountId?: string,
  ): Promise<Transaction[]> {
    return this.transactionsService.findAll(accountId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get transaction by ID',
    description:
      'Retrieves a single transaction with account, customer, and deposito type details',
  })
  @ApiParam({
    name: 'id',
    description: 'Transaction UUID',
    example: '880e8400-e29b-41d4-a716-446655440003',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction found',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  async findOne(@Param('id') id: string): Promise<Transaction> {
    return this.transactionsService.findOne(id);
  }
}
