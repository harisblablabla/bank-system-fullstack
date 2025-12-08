import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';
import { CustomersModule } from '../customers/customers.module';
import { DepositoTypesModule } from '../deposito-types/deposito-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    CustomersModule,
    DepositoTypesModule,
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService, TypeOrmModule],
})
export class AccountsModule {}
