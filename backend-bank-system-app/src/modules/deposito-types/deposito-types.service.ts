import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepositoType } from './entities/deposito-type.entity';
import { CreateDepositoTypeDto } from './dto/create-deposito-type.dto';
import { UpdateDepositoTypeDto } from './dto/update-deposito-type.dto';

@Injectable()
export class DepositoTypesService {
  private readonly logger = new Logger(DepositoTypesService.name);

  constructor(
    @InjectRepository(DepositoType)
    private readonly depositoTypeRepository: Repository<DepositoType>,
  ) {}

  /**
   * Create a new deposito type
   */
  async create(
    createDepositoTypeDto: CreateDepositoTypeDto,
  ): Promise<DepositoType> {
    try {
      // Check if name already exists
      const existingType = await this.depositoTypeRepository.findOne({
        where: { name: createDepositoTypeDto.name },
      });

      if (existingType) {
        throw new ConflictException(
          `Deposito type with name '${createDepositoTypeDto.name}' already exists`,
        );
      }

      const depositoType = this.depositoTypeRepository.create(
        createDepositoTypeDto,
      );
      const savedType = await this.depositoTypeRepository.save(depositoType);

      this.logger.log(`Deposito type created: ${savedType.id}`);
      return savedType;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      const errorMessage = (error as Error).message;
      this.logger.error(`Failed to create deposito type: ${errorMessage}`);
      throw new BadRequestException('Failed to create deposito type');
    }
  }

  /**
   * Get all deposito types
   */
  async findAll(): Promise<DepositoType[]> {
    try {
      return await this.depositoTypeRepository.find({
        relations: ['accounts'],
        order: { yearlyReturn: 'ASC' },
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.logger.error(`Failed to fetch deposito types: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch deposito types');
    }
  }

  /**
   * Get a single deposito type by ID
   */
  async findOne(id: string): Promise<DepositoType> {
    try {
      const depositoType = await this.depositoTypeRepository.findOne({
        where: { id },
        relations: ['accounts'],
      });

      if (!depositoType) {
        throw new NotFoundException(`Deposito type with ID ${id} not found`);
      }

      return depositoType;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = (error as Error).message;
      this.logger.error(`Failed to fetch deposito type: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch deposito type');
    }
  }

  /**
   * Update a deposito type
   */
  async update(
    id: string,
    updateDepositoTypeDto: UpdateDepositoTypeDto,
  ): Promise<DepositoType> {
    try {
      // Check if deposito type exists
      const depositoType = await this.findOne(id);

      // If updating name, check for duplicates
      if (
        updateDepositoTypeDto.name &&
        updateDepositoTypeDto.name !== depositoType.name
      ) {
        const existingType = await this.depositoTypeRepository.findOne({
          where: { name: updateDepositoTypeDto.name },
        });

        if (existingType) {
          throw new ConflictException(
            `Deposito type with name '${updateDepositoTypeDto.name}' already exists`,
          );
        }
      }

      // Update the deposito type
      Object.assign(depositoType, updateDepositoTypeDto);
      const updatedType = await this.depositoTypeRepository.save(depositoType);

      this.logger.log(`Deposito type updated: ${id}`);
      return updatedType;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const errorMessage = (error as Error).message;
      this.logger.error(`Failed to update deposito type: ${errorMessage}`);
      throw new BadRequestException('Failed to update deposito type');
    }
  }

  /**
   * Delete a deposito type
   */
  async remove(id: string): Promise<void> {
    try {
      // Check if deposito type exists
      const depositoType = await this.findOne(id);

      // Check if any accounts use this deposito type
      if (depositoType.accounts && depositoType.accounts.length > 0) {
        throw new ConflictException(
          `Cannot delete deposito type: ${depositoType.accounts.length} account(s) are using it`,
        );
      }

      // Delete the deposito type
      await this.depositoTypeRepository.delete(id);

      this.logger.log(`Deposito type deleted: ${id}`);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const errorMessage = (error as Error).message;
      this.logger.error(`Failed to delete deposito type: ${errorMessage}`);
      throw new BadRequestException('Failed to delete deposito type');
    }
  }
}
