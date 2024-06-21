import { JwtService } from '@nestjs/jwt';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import type { Request } from 'express';

import { MerchantPayload } from 'src/merchant/merchant.service';
import { UserRole } from 'src/user/schemas/user_schema';

@Injectable()
export class MerchantGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.header('authorization').split(' ')[1];

    if (!token) {
      return false;
    }

    const payload = await this.jwtService.verifyAsync<MerchantPayload>(token);

    if (!payload || !payload.id) {
      return false;
    }

    if (payload.role !== UserRole.MERCHANT) {
      return false;
    }

    request.body['userId'] = payload.id;
    request.body['shopId'] = payload.shopId;

    return true;
  }
}
