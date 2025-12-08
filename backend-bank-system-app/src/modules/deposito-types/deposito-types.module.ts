import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositoTypesController } from './deposito-types.controller';
import { DepositoTypesService } from './deposito-types.service';
import { DepositoType } from './entities/deposito-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DepositoType])],
  controllers: [DepositoTypesController],
  providers: [DepositoTypesService],
  exports: [DepositoTypesService, TypeOrmModule],
})
export class DepositoTypesModule {}
