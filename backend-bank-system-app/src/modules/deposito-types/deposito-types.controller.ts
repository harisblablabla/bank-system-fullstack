import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { DepositoTypesService } from './deposito-types.service';
import { CreateDepositoTypeDto } from './dto/create-deposito-type.dto';
import { UpdateDepositoTypeDto } from './dto/update-deposito-type.dto';
import { DepositoType } from './entities/deposito-type.entity';

@ApiTags('Deposito Types')
@Controller('deposito-types')
export class DepositoTypesController {
  constructor(private readonly depositoTypesService: DepositoTypesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new deposito type',
    description: 'Creates a new deposito type with yearly return rate',
  })
  @ApiBody({ type: CreateDepositoTypeDto })
  @ApiResponse({
    status: 201,
    description: 'Deposito type successfully created',
    type: DepositoType,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - deposito type name already exists',
  })
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createDepositoTypeDto: CreateDepositoTypeDto,
  ): Promise<DepositoType> {
    return this.depositoTypesService.create(createDepositoTypeDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all deposito types',
    description:
      'Retrieves all available deposito types ordered by yearly return',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all deposito types',
    type: [DepositoType],
  })
  async findAll(): Promise<DepositoType[]> {
    return this.depositoTypesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get deposito type by ID',
    description: 'Retrieves a single deposito type with associated accounts',
  })
  @ApiParam({
    name: 'id',
    description: 'Deposito Type UUID',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Deposito type found',
    type: DepositoType,
  })
  @ApiResponse({
    status: 404,
    description: 'Deposito type not found',
  })
  async findOne(@Param('id') id: string): Promise<DepositoType> {
    return this.depositoTypesService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update deposito type',
    description: 'Updates an existing deposito type',
  })
  @ApiParam({
    name: 'id',
    description: 'Deposito Type UUID',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @ApiBody({ type: UpdateDepositoTypeDto })
  @ApiResponse({
    status: 200,
    description: 'Deposito type successfully updated',
    type: DepositoType,
  })
  @ApiResponse({
    status: 404,
    description: 'Deposito type not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - deposito type name already exists',
  })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateDepositoTypeDto: UpdateDepositoTypeDto,
  ): Promise<DepositoType> {
    return this.depositoTypesService.update(id, updateDepositoTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete deposito type',
    description: 'Deletes a deposito type if no accounts are using it',
  })
  @ApiParam({
    name: 'id',
    description: 'Deposito Type UUID',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 204,
    description: 'Deposito type successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Deposito type not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - deposito type is in use by accounts',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.depositoTypesService.remove(id);
  }
}
