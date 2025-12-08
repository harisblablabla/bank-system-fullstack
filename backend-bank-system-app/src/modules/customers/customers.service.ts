/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  /**
   * Create a new customer
   */
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      const customer = this.customerRepository.create(createCustomerDto);
      const savedCustomer = await this.customerRepository.save(customer);

      this.logger.log(`Customer created: ${savedCustomer.id}`);
      return savedCustomer;
    } catch (error) {
      this.logger.error(`Failed to create customer: ${error.message}`);
      throw new BadRequestException('Failed to create customer');
    }
  }

  /**
   * Get all customers
   */
  async findAll(): Promise<Customer[]> {
    try {
      return await this.customerRepository.find({
        relations: ['accounts'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(`Failed to fetch customers: ${error.message}`);
      throw new BadRequestException('Failed to fetch customers');
    }
  }

  /**
   * Get a single customer by ID
   */
  async findOne(id: string): Promise<Customer> {
    try {
      const customer = await this.customerRepository.findOne({
        where: { id },
        relations: ['accounts', 'accounts.depositoType'],
      });

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

      return customer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch customer: ${error.message}`);
      throw new BadRequestException('Failed to fetch customer');
    }
  }

  /**
   * Update a customer
   */
  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    try {
      // Check if customer exists
      const customer = await this.findOne(id);

      // Update the customer
      Object.assign(customer, updateCustomerDto);
      const updatedCustomer = await this.customerRepository.save(customer);

      this.logger.log(`Customer updated: ${id}`);
      return updatedCustomer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update customer: ${error.message}`);
      throw new BadRequestException('Failed to update customer');
    }
  }

  /**
   * Delete a customer
   */
  async remove(id: string): Promise<void> {
    try {
      // Check if customer exists
      await this.findOne(id);

      // Delete the customer (CASCADE will delete associated accounts)
      await this.customerRepository.delete(id);

      this.logger.log(`Customer deleted: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete customer: ${error.message}`);
      throw new BadRequestException('Failed to delete customer');
    }
  }
}
