import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new account',
    description:
      'Opens a new account for a customer with a selected deposito type',
  })
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({
    status: 201,
    description: 'Account successfully created',
    type: Account,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer or Deposito Type not found',
  })
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all accounts',
    description: 'Retrieves all accounts with optional customer filter',
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'Filter accounts by customer UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'List of accounts',
    type: [Account],
  })
  async findAll(@Query('customerId') customerId?: string): Promise<Account[]> {
    return this.accountsService.findAll(customerId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get account by ID',
    description:
      'Retrieves a single account with customer, deposito type, and transactions',
  })
  @ApiParam({
    name: 'id',
    description: 'Account UUID',
    example: '770e8400-e29b-41d4-a716-446655440002',
  })
  @ApiResponse({
    status: 200,
    description: 'Account found',
    type: Account,
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  async findOne(@Param('id') id: string): Promise<Account> {
    return this.accountsService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update account',
    description:
      'Updates account packet name or deposito type (cannot change customer)',
  })
  @ApiParam({
    name: 'id',
    description: 'Account UUID',
    example: '770e8400-e29b-41d4-a716-446655440002',
  })
  @ApiBody({ type: UpdateAccountDto })
  @ApiResponse({
    status: 200,
    description: 'Account successfully updated',
    type: Account,
  })
  @ApiResponse({
    status: 404,
    description: 'Account or Deposito Type not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete account',
    description:
      'Closes an account and deletes all associated transactions (CASCADE)',
  })
  @ApiParam({
    name: 'id',
    description: 'Account UUID',
    example: '770e8400-e29b-41d4-a716-446655440002',
  })
  @ApiResponse({
    status: 204,
    description: 'Account successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.accountsService.remove(id);
  }
}
