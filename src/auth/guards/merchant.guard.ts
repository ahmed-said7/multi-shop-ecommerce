import { JwtService } from '@nestjs/jwt';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request } from 'express';

import { MerchantPayload } from 'src/merchant/merchant.service';
import { UserRole } from 'src/user/schemas/user_schema';

@Injectable()
export class MerchantGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  private readonly logger = new Logger(MerchantGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = request.header('authorization').split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('expire token or invalid');
    }

    const payload = await this.jwtService.verifyAsync<MerchantPayload>(token);

    if (!payload || !payload.id) {
      return false;
    }

    if (payload.role !== UserRole.MERCHANT) {
      return false;
    }

    request.user = payload;

    return true;
  }
}
