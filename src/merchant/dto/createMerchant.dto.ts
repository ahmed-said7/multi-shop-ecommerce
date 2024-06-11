import { Types } from 'mongoose';

import { Gender, UserRole } from '../../user/schemas/user_schema';

export class CreateMerchantDto {
  name: string;
  email: string;
  phone: string;
  wallet: number;
  password: string;

  birthday?: string;

  gender: Gender;
  role: UserRole.MERCHANT;

  shop: Types.ObjectId;
}
