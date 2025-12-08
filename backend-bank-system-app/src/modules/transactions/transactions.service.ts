import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { WithdrawalResponseDto } from './dto/withdrawal-response.dto';
import { InterestCalculator } from './utils/interest-calculator';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Deposit money to an account
   */
  async deposit(depositDto: DepositDto): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get account with lock to prevent race conditions
      const account = await queryRunner.manager.findOne(Account, {
        where: { id: depositDto.accountId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!account) {
        throw new NotFoundException(
          `Account with ID ${depositDto.accountId} not found`,
        );
      }

      const balanceBefore = Number(account.balance);
      const balanceAfter = balanceBefore + depositDto.amount;

      // Update account balance
      account.balance = balanceAfter;
      await queryRunner.manager.save(Account, account);

      // Create transaction record
      const transaction = queryRunner.manager.create(Transaction, {
        accountId: depositDto.accountId,
        type: TransactionType.DEPOSIT,
        amount: depositDto.amount,
        transactionDate: new Date(depositDto.transactionDate),
        balanceBefore,
        balanceAfter,
        monthsHeld: 0,
        interestEarned: 0,
      });

      const savedTransaction = await queryRunner.manager.save(
        Transaction,
        transaction,
      );

      await queryRunner.commitTransaction();

      this.logger.log(
        `Deposit successful: ${depositDto.amount} to account ${depositDto.accountId}`,
      );

      return savedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = (error as Error).message;
      this.logger.error(`Deposit failed: ${errorMessage}`);
      throw new BadRequestException('Deposit transaction failed');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Withdraw money from an account with interest calculation
   */
  async withdraw(withdrawDto: WithdrawDto): Promise<WithdrawalResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get account with deposito type, locked to prevent race conditions
      const account = await queryRunner.manager.findOne(Account, {
        where: { id: withdrawDto.accountId },
        relations: ['depositoType'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!account) {
        throw new NotFoundException(
          `Account with ID ${withdrawDto.accountId} not found`,
        );
      }

      const currentBalance = Number(account.balance);

      // Check sufficient balance
      if (currentBalance < withdrawDto.amount) {
        throw new BadRequestException(
          `Insufficient balance. Available: ${currentBalance}, Requested: ${withdrawDto.amount}`,
        );
      }

      // Get the last deposit transaction to calculate months held
      const lastDeposit = await queryRunner.manager.findOne(Transaction, {
        where: {
          accountId: withdrawDto.accountId,
          type: TransactionType.DEPOSIT,
        },
        order: { transactionDate: 'DESC' },
      });

      // Calculate interest
      let monthsHeld = 0;
      let interestEarned = 0;
      let endingBalance = currentBalance;

      if (lastDeposit) {
        const calculation = InterestCalculator.calculateWithdrawalInterest(
          currentBalance,
          Number(account.depositoType.yearlyReturn),
          lastDeposit.transactionDate,
          new Date(withdrawDto.transactionDate),
        );

        monthsHeld = calculation.monthsHeld;
        interestEarned = calculation.interestEarned;
        endingBalance = calculation.endingBalance;
      }

      // Calculate balance after withdrawal
      const balanceAfter = endingBalance - withdrawDto.amount;

      // Update account balance
      account.balance = balanceAfter;
      await queryRunner.manager.save(Account, account);

      // Create transaction record
      const transaction = queryRunner.manager.create(Transaction, {
        accountId: withdrawDto.accountId,
        type: TransactionType.WITHDRAWAL,
        amount: withdrawDto.amount,
        transactionDate: new Date(withdrawDto.transactionDate),
        balanceBefore: currentBalance,
        balanceAfter,
        monthsHeld,
        interestEarned,
      });

      const savedTransaction = await queryRunner.manager.save(
        Transaction,
        transaction,
      );

      await queryRunner.commitTransaction();

      this.logger.log(
        `Withdrawal successful: ${withdrawDto.amount} from account ${withdrawDto.accountId}, Interest: ${interestEarned}`,
      );

      // Return withdrawal response with ending balance
      return {
        ...savedTransaction,
        endingBalance: balanceAfter,
        summary: `Successfully withdrawn ${withdrawDto.amount.toFixed(2)} with ${interestEarned.toFixed(2)} interest earned over ${monthsHeld} months`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const errorMessage = (error as Error).message;
      this.logger.error(`Withdrawal failed: ${errorMessage}`);
      throw new BadRequestException('Withdrawal transaction failed');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get all transactions with optional account filter
   */
  async findAll(accountId?: string): Promise<Transaction[]> {
    try {
      const queryBuilder = this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.account', 'account')
        .leftJoinAndSelect('account.customer', 'customer')
        .leftJoinAndSelect('account.depositoType', 'depositoType')
        .orderBy('transaction.transactionDate', 'DESC');

      if (accountId) {
        queryBuilder.where('transaction.accountId = :accountId', { accountId });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error(`Failed to fetch transactions: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch transactions');
    }
  }

  /**
   * Get a single transaction by ID
   */
  async findOne(id: string): Promise<Transaction> {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id },
        relations: ['account', 'account.customer', 'account.depositoType'],
      });

      if (!transaction) {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
      }

      return transaction;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = (error as Error).message;
      this.logger.error(`Failed to fetch transaction: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch transaction');
    }
  }
}
