import { PartialType } from '@nestjs/swagger';
import { CreateDepositoTypeDto } from './create-deposito-type.dto';

export class UpdateDepositoTypeDto extends PartialType(CreateDepositoTypeDto) {
  // All properties from CreateDepositoTypeDto are now optional
  // Allows updating name, yearlyReturn
}
