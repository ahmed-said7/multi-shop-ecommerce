import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto, CreateCartItemDto } from './create-cart.dto';

export class UpdateCartDto extends PartialType(CreateCartDto) {}

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {}
