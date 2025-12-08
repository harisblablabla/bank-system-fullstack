import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(
  OmitType(CreateAccountDto, ['customerId'] as const),
) {
  // Can update 'packet' and 'depositoTypeId', but NOT 'customerId'
}
