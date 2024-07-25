import { PartialType } from '@nestjs/mapped-types';
import { CreateMerchantDto } from './createMerchant.dto';
export class UpdateMerchantDto extends PartialType(CreateMerchantDto)  {};
