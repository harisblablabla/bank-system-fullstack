import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Customer } from '../customers/entities/customer.entity';
import { DepositoType } from '../deposito-types/entities/deposito-type.entity';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(DepositoType)
    private readonly depositoTypeRepository: Repository<DepositoType>,
  ) {}

  /**
   * Create a new account
   */
  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    try {
      // Verify customer exists
      const customer = await this.customerRepository.findOne({
        where: { id: createAccountDto.customerId },
      });
      if (!customer) {
        throw new NotFoundException(
          `Customer with ID ${createAccountDto.customerId} not found`,
        );
      }

      // Verify deposito type exists
      const depositoType = await this.depositoTypeRepository.findOne({
        where: { id: createAccountDto.depositoTypeId },
      });
      if (!depositoType) {
        throw new NotFoundException(
          `Deposito type with ID ${createAccountDto.depositoTypeId} not found`,
        );
      }

      // Create the account
      const account = this.accountRepository.create({
        ...createAccountDto,
        balance: 0, // Initial balance is always 0
      });

      const savedAccount = await this.accountRepository.save(account);
      this.logger.log(`Account created: ${savedAccount.id}`);

      // Return with relations
      return this.findOne(savedAccount.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = (error as Error).message;
      this.logger.error(`Failed to create account: ${errorMessage}`);
      throw new BadRequestException('Failed to create account');
    }
  }

  /**
   * Get all accounts with optional customer filter
   */
  async findAll(customerId?: string): Promise<Account[]> {
    try {
      const queryBuilder = this.accountRepository
        .createQueryBuilder('account')
        .leftJoinAndSelect('account.customer', 'customer')
        .leftJoinAndSelect('account.depositoType', 'depositoType')
        .orderBy('account.createdAt', 'DESC');

      if (customerId) {
        queryBuilder.where('account.customerId = :customerId', { customerId });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error(`Failed to fetch accounts: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch accounts');
    }
  }

  /**
   * Get a single account by ID
   */
  async findOne(id: string): Promise<Account> {
    try {
      const account = await this.accountRepository.findOne({
        where: { id },
        relations: ['customer', 'depositoType', 'transactions'],
      });

      if (!account) {
        throw new NotFoundException(`Account with ID ${id} not found`);
      }

      return account;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = (error as Error).message;
      this.logger.error(`Failed to fetch account: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch account');
    }
  }

  /**
   * Update an account
   */
  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    try {
      // 1. Check if account exists
      const account = await this.accountRepository.findOne({
        where: { id },
        relations: ['customer', 'depositoType'],
      });

      if (!account) {
        throw new NotFoundException(`Account with ID ${id} not found`);
      }

      // 2. Handle Packet update
      if (updateAccountDto.packet) {
        account.packet = updateAccountDto.packet;
      }

      // 3. Handle DepositoType update
      if (updateAccountDto.depositoTypeId) {
        const depositoType = await this.depositoTypeRepository.findOne({
          where: { id: updateAccountDto.depositoTypeId },
        });

        if (!depositoType) {
          throw new NotFoundException(
            `Deposito type with ID ${updateAccountDto.depositoTypeId} not found`,
          );
        }
        account.depositoType = depositoType;
        account.depositoTypeId = updateAccountDto.depositoTypeId;
      }

      await this.accountRepository.save(account);

      this.logger.log(`Account updated: ${id}`);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = (error as Error).message;
      this.logger.error(`Failed to update account: ${errorMessage}`);
      throw new BadRequestException('Failed to update account');
    }
  }

  /**
   * Delete an account
   */
  async remove(id: string): Promise<void> {
    try {
      // Check if account exists
      await this.findOne(id);

      // Delete the account (CASCADE will delete associated transactions)
      await this.accountRepository.delete(id);

      this.logger.log(`Account deleted: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = (error as Error).message;
      this.logger.error(`Failed to delete account: ${errorMessage}`);
      throw new BadRequestException('Failed to delete account');
    }
  }

  /**
   * Update account balance (used by transactions service)
   */
  async updateBalance(id: string, newBalance: number): Promise<Account> {
    const account = await this.findOne(id);
    account.balance = newBalance;
    return await this.accountRepository.save(account);
  }
}
